/**
 * Gulp tasks for bundling vendor modules.
 */
const fs = require("fs");
const gulp = require("gulp");
const path = require("path");
const Builder = require("systemjs-builder");
const util = require("util");
const clientPackages = require("../../util/client-packages");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("build-bundle-vendor", async () => {
    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, false);
    if (buildConfiguration.bundle) {
        display.info("Running", "Systemjs builder for Vendor");
        const keys = clientPackages.getRequires(uniteConfig, ["app", "both"], true);
        try {
            await util.promisify(fs.writeFile)(path.join(uniteConfig.dirs.www.dist, "vendor-bundle-init.js"), `System.register(${JSON.stringify(keys)}, function () {});`);
        } catch (err) {
            display.error("Writing vendor-bundle-init.js", err);
            process.exit(1);
        }
        try {
            const builder = new Builder("./", `${uniteConfig.dirs.www.dist}app-module-config.js`);
            await builder.bundle(path.join(uniteConfig.dirs.www.dist, "vendor-bundle-init.js"), path.join(uniteConfig.dirs.www.dist, "vendor-bundle.js"), {
                minify: buildConfiguration.minify
            });
        } catch (err) {
            display.error("Running bundler", err);
            process.exit(1);
        }
    }
});
// Generated by UniteJS
