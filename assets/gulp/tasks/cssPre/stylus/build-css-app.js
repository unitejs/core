/**
 * Gulp tasks for building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const stylus = require("gulp-stylus");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");
const gutil = require("gulp-util");
const errorUtil = require("./util/error-util");

gulp.task("build-css-app", async () => {
    display.info("Running", "Stylus for App");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    let errorCount = 0;

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.dirs.www.cssSrc, "main.styl"))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(stylus())
        .on("error", (err) => {
            display.error(err.message);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(uniteConfig.dirs.www.cssDist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});

/* Generated by UniteJS */
