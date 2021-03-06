/**
 * Gulp tasks for bundling SystemJS modules.
 */
import * as fs from "fs";
import * as gulp from "gulp";
import * as insert from "gulp-insert";
import * as sourcemaps from "gulp-sourcemaps";
import * as uglify from "gulp-uglify";
import * as path from "path";
import * as Builder from "systemjs-builder";
import * as through2 from "through2";
import * as util from "util";
import { IUniteBuildConfiguration } from "../../../types/IUniteBuildConfiguration";
import { IUniteConfiguration } from "../../../types/IUniteConfiguration";
import * as asyncUtil from "../../util/async-util";
import * as clientPackages from "../../util/client-packages";
import * as display from "../../util/display";
import * as moduleConfig from "../../util/module-config";
import * as uc from "../../util/unite-config";

async function addBootstrap(uniteConfig: IUniteConfiguration, buildConfiguration: IUniteBuildConfiguration): Promise<void> {
    let bootstrap = moduleConfig.create(uniteConfig, ["app", "both"], true, "");
    bootstrap += "Promise.all(preloadModules.map(function(module) { return SystemJS.import(module); }))";
    bootstrap += ".then(function() {";
    bootstrap += "SystemJS.import('dist/entryPoint');";
    bootstrap += "});";

    const bootstrapFile = path.join(uniteConfig.dirs.www.dist, "app-bundle-bootstrap.js");

    try {
        await util.promisify(fs.writeFile)(bootstrapFile, bootstrap);
    } catch (err) {
        display.error("Writing app-bundle-bootstrap.js", err);
        process.exit(1);
    }

    await asyncUtil.stream(gulp.src(bootstrapFile)
        .pipe(buildConfiguration.minify ? uglify() : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.dist)));

    let bootstrap2 = null;
    try {
        bootstrap2 = await util.promisify(fs.readFile)(bootstrapFile);
    } catch (err) {
        display.error("Reading app-bundle-bootstrap.js", err);
        process.exit(1);
    }

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.dist, "app-bundle.js"))
        .pipe(buildConfiguration.sourcemaps
            ? sourcemaps.init({ loadMaps: true }) : through2.obj())
        .pipe(insert.append(bootstrap2.toString()))
        .pipe(buildConfiguration.sourcemaps
            ? sourcemaps.write({ includeContent: true }) : through2.obj())
        .pipe(gulp.dest(uniteConfig.dirs.www.dist)));
}

gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);

    if (buildConfiguration.bundle) {
        display.info("Running", "Systemjs builder for App");

        const builder = new Builder("./", `${uniteConfig.dirs.www.dist}app-module-config.js`);

        const dist = uniteConfig.dirs.www.dist;
        const moduleIds = clientPackages.getModuleIds(uniteConfig, ["app", "both"]);
        const hasText = moduleIds.indexOf("systemjs-plugin-text") >= 0;
        const hasCss = moduleIds.indexOf("systemjs-plugin-css") >= 0;

        const packageFiles = [
            `${dist}**/*.js`
        ];

        if (hasText) {
            packageFiles.push(` + ${dist}**/*.${uc.extensionMap(uniteConfig.viewExtensions)}!text`);
        }
        if (hasText || hasCss) {
            packageFiles.push(` + ${dist}**/*.css!${hasCss ? "css" : "text"}`);
        }

        packageFiles.push(` - ${dist}vendor-bundle.js`);
        packageFiles.push(` - ${dist}vendor-bundle-init.js`);
        packageFiles.push(` - ${dist}app-module-config.js`);

        const sourceMapsFlag = buildConfiguration.sourcemaps ? "inline" : false;

        try {
            await builder.bundle(
                packageFiles.join(""),
                path.join(uniteConfig.dirs.www.dist, "app-bundle.js"),
                {
                    minify: buildConfiguration.minify,
                    sourceMaps: sourceMapsFlag
                }
            );

            return addBootstrap(uniteConfig, buildConfiguration);
        } catch (err) {
            display.error("Running bundler", err);
            process.exit(1);
        }
    }
});

// Generated by UniteJS
