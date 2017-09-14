/**
 * Gulp tasks for building JavaScript.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const babel = require("gulp-babel");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const gutil = require("gulp-util");
const asyncUtil = require("./util/async-util");
const errorUtil = require("./util/error-util");

gulp.task("build-transpile", async () => {
    display.info("Running", "Babel");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig, true);

    let errorCount = 0;

    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.src,
        `**/*.${uc.extensionMap(uniteConfig.sourceExtensions)}`
    ))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(babel())
        .on("error", (err) => {
            display.error(err.message);
            display.error(`\n${err.codeFrame}`);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .pipe(buildConfiguration.minify ? uglify()
            .on("error", (err) => {
                display.error(err.toString());
            }) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps
            ? sourcemaps.mapSources((sourcePath) => `./src/${sourcePath}`) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
            "includeContent": true,
            "sourceRoot": ""
        }) : gutil.noop())
        .pipe(gulp.dest(uniteConfig.dirs.www.dist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});

/* Generated by UniteJS */
