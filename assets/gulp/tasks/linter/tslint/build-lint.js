/**
 * Gulp tasks for linting modules.
 */
const display = require("./util/display");
const gulp = require("gulp");
const tslint = require("gulp-tslint");
const path = require("path");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");

gulp.task("build-lint", async () => {
    display.info("Running", "TSLint");

    const uniteConfig = await uc.getUniteConfig();

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.directories.src, "**/*.{ts,tsx}"))
        .pipe(tslint({"formatter": "verbose"}))
        .pipe(tslint.report())
        .on("error", () => {
            process.exit(1);
        }));
});

/* Generated by UniteJS */
