/**
 * Gulp tasks for docker platform.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const runSequence = require("run-sequence");
const util = require("util");
const path = require("path");
const del = require("del");
const fs = require("fs");
const asyncUtil = require("./util/async-util");
const packageConfig = require("./util/package-config");
const platformUtils = require("./util/platform-utils");
const minimist = require("minimist");
const exec = require("./util/exec");

gulp.task("platform-docker-package", async () => {
    try {
        await util.promisify(runSequence)(
            "platform-docker-clean",
            "platform-docker-gather",
            "platform-docker-build-image"
        );
    } catch (err) {
        display.error("Unhandled error during task", err);
        process.exit(1);
    }
});

gulp.task("platform-docker-clean", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    let defaultImage = "nginx";
    if (uniteConfig.platforms &&
        uniteConfig.platforms.Docker) {
        defaultImage = uniteConfig.platforms.Docker.image || defaultImage;
    }

    const knownOptions = {
        "default": {
            "image": defaultImage
        },
        "string": [
            "image"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    const toClean = [
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}/docker/**/*`),
        path.join("../", uniteConfig.dirs.packagedRoot, `/${packageJson.version}_docker_${options.image}.tar`)
    ];
    display.info("Cleaning", toClean);
    return del(toClean, {"force": true});
});

gulp.task("platform-docker-gather", async () => {
    const uniteConfig = await uc.getUniteConfig();

    let defaultImage = "nginx";
    let defaultWww = "/usr/share/nginx/html";
    if (uniteConfig.platforms &&
        uniteConfig.platforms.Docker) {
        defaultImage = uniteConfig.platforms.Docker.image || defaultImage;
        defaultWww = uniteConfig.platforms.Docker.www || defaultWww;
    }

    const knownOptions = {
        "default": {
            "image": defaultImage,
            "www": defaultWww
        },
        "string": [
            "image",
            "www"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    const platformRoot = await platformUtils.gatherFiles("Docker", options.www);

    display.info("Copying Image Additions");

    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.assetsSrc,
        `docker/${options.image}/**/*`
    ), {"dot": true})
        .pipe(gulp.dest(platformRoot)));
});

gulp.task("platform-docker-build-image", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const packageJson = await packageConfig.getPackageJson();

    let defaultImage = "nginx";
    if (uniteConfig.platforms &&
        uniteConfig.platforms.Docker) {
        defaultImage = uniteConfig.platforms.Docker.image || defaultImage;
    }

    const knownOptions = {
        "default": {
            "image": defaultImage
        },
        "string": [
            "image"
        ]
    };

    const options = minimist(process.argv.slice(2), knownOptions);

    display.info("Writing Dockerfile");

    const platformRoot = path.resolve(path.join(
        "../",
        uniteConfig.dirs.packagedRoot,
        `/${packageJson.version}/`
    ));

    const dockerFilename = path.join(platformRoot, "dockerfile");

    try {
        const dockerFile = `FROM ${options.image}\nCOPY docker /`;

        await util.promisify(fs.writeFile)(dockerFilename, dockerFile);
    } catch (err) {
        display.error("Creating dockerfile failed", err);
        process.exit(1);
    }

    display.info("Building Image", "Docker");

    const tagName = `${packageJson.name}:v${packageJson.version}`;

    try {
        await exec.launch("docker", [
            "build",
            ".",
            "--file=dockerfile",
            "--pull",
            `--tag=${tagName}`
        ], platformRoot);
    } catch (err) {
        display.error("Building docker image failed", err);
        process.exit(1);
    }

    try {
        const dockerArchive = path.resolve(path.join(
            "../",
            uniteConfig.dirs.packagedRoot
        ));

        await exec.launch("docker", [
            "save",
            `--output=${packageJson.version}_docker_${options.image}.tar`,
            tagName
        ], dockerArchive);
    } catch (err) {
        display.error("Saving docker image failed", err);
        process.exit(1);
    }

    return del([dockerFilename], {"force": true});
});

/* Generated by UniteJS */
