/**
 * Gulp utilities for platform.
 */
import * as gulp from "gulp";
import * as path from "path";
import { IPackageJson } from "src/types/IPackageJson";
import { IUniteBuildConfiguration } from "../../types/IUniteBuildConfiguration";
import { IUniteConfiguration } from "../../types/IUniteConfiguration";
import * as asyncUtil from "./async-util";
import * as clientPackages from "./client-packages";
import * as display from "./display";
import * as themeUtils from "./theme-utils";

export async function listFiles(uniteConfig: IUniteConfiguration, buildConfiguration: IUniteBuildConfiguration): Promise<{src: string; moveToRoot?: boolean}[]> {
    const bundleExists = await asyncUtil.fileExists(path.join(uniteConfig.dirs.www.dist, "app-bundle.js"));
    if (buildConfiguration.bundle && !bundleExists) {
        display.error(`You have specified configuration '${buildConfiguration.name}' which is bundled,` +
            " but the dist folder contains a non bundled build.");
        display.error("Please add the --buildConfiguration argument to this task," +
            " or rebuild the app with a different configuration.");
        process.exit(1);
    } else if (!buildConfiguration.bundle && bundleExists) {
        display.error(`You have specified configuration '${buildConfiguration.name}' which is not bundled,` +
            " but the dist folder contains a bundled build.");
        display.error("Please add the --buildConfiguration argument to this task," +
            " or rebuild the app with a different configuration.");
        process.exit(1);
    }

    let files: {src: string; moveToRoot?: boolean}[] = [
        { src: path.join("./", "index.html") },
        { src: path.join("./", "service-worker.js") },
        { src: path.join(uniteConfig.dirs.www.dist, "**/*") },
        { src: path.join(uniteConfig.dirs.www.cssDist, "**/*") },
        { src: path.join(uniteConfig.dirs.www.assets, "**/*") },
        { src: path.join(uniteConfig.dirs.www.assetsSrc, "root/**/*"), moveToRoot: true }
    ];

    const packageFiles = clientPackages.getDistFiles(
        uniteConfig,
        ["app", "both"],
        buildConfiguration.bundle,
        buildConfiguration.minify
    );
    packageFiles.forEach((packageFile) => {
        files = files.concat({ src: packageFile });
    });

    files = files.concat(clientPackages.getAssets(uniteConfig).map(a =>
        ({ src: a })));

    return files;
}

export async function gatherFiles(uniteConfig: IUniteConfiguration, buildConfiguration: IUniteBuildConfiguration, packageJson: IPackageJson, platformName: string, gatherRoot: string): Promise<void> {
    display.info("Gathering Files", platformName);

    const files = await listFiles(uniteConfig, buildConfiguration);

    display.info("Destination", gatherRoot);

    for (let i = 0; i < files.length; i++) {
        const fileDest = files[i].moveToRoot ? gatherRoot
            : path.join(
                gatherRoot,
                files[i].src.indexOf("**") > 0
                    ? files[i].src.replace(/\*\*[/\\]\*(.*)/, "") : path.dirname(files[i].src)
            );

        display.info("Copying Files", files[i].src);
        display.info("To", fileDest);

        await asyncUtil.stream(gulp.src(files[i].src, { dot: true })
            .pipe(gulp.dest(fileDest)));
    }

    if (buildConfiguration.pwa) {
        await themeUtils.buildPwa(uniteConfig, buildConfiguration, packageJson, files, gatherRoot, true);
    }
}

export function getConfig(uniteConfig: IUniteConfiguration, platformName: string): { [id: string]: any } {
    if (uniteConfig.platforms &&
        uniteConfig.platforms[platformName]) {
        return uniteConfig.platforms[platformName];
    } else {
        return {};
    }
}

// Generated by UniteJS