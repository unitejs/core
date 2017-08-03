/**
 * Gulp tasks for post building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");
const gutil = require("gulp-util");
const cssnano = require("cssnano");

gulp.task("build-css-post-components", async () => {
    display.info("Running", "PostCss for Components");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    return asyncUtil.stream(gulp.src(path.join(uniteConfig.directories.dist, "**/*.css"))
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.init() : gutil.noop())
        .pipe(postcss())
        .pipe(buildConfiguration.minify ? postcss([cssnano()]) : gutil.noop())
        .pipe(buildConfiguration.sourcemaps ? sourcemaps.write({
            "includeContent": true,
            "sourceRoot": "./src"
        }) : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.dist)));
});

/* Generated by UniteJS */
