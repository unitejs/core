/**
 * Gulp tasks for bundling vendor modules.
 */
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uc = require("./util/unite-config");
const clientPackages = require("./util/client-packages");
const display = require("./util/display");
const Builder = require("systemjs-builder");

gulp.task("build-bundle-vendor", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.bundle) {
        display.info("Running", "Systemjs builder for Vendor");

        const keys = clientPackages.getRequires(uniteConfig, ["app", "both"], true);

        try {
            await util.promisify(fs.writeFile)(
                path.join(uniteConfig.dirs.www.dist, "vendor-bundle-init.js"),
                `System.register(${JSON.stringify(keys)}, function () {});`
            );
        } catch (err) {
            display.error("Writing vendor-bundle-init.js", err);
            process.exit(1);
        }

        try {
            const builder = new Builder(
                "./",
                `${uniteConfig.dirs.www.dist}app-module-config.js`
            );

            await builder.bundle(
                path.join(uniteConfig.dirs.www.dist, "vendor-bundle-init.js"),
                path.join(uniteConfig.dirs.www.dist, "vendor-bundle.js"),
                {
                    "minify": buildConfiguration.minify
                }
            );
        } catch (err) {
            display.error("Running bundler", err);
            process.exit(1);
        }
    }
});

/* Generated by UniteJS */
