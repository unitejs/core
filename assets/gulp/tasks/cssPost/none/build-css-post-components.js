/**
 * Gulp tasks for post building css.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");
const cssnano = require("gulp-cssnano");
const gutil = require("gulp-util");
const merge = require("merge2");

gulp.task("build-css-post-components", async () => {
    display.info("Running", "CSS None for Components");

    const uniteConfig = await uc.getUniteConfig();
    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    const streams = [];

    streams.push(gulp.src(path.join(uniteConfig.directories.dist, "**/*.css"))
        .pipe(buildConfiguration.minify ? cssnano() : gutil.noop())
        .pipe(gulp.dest(uniteConfig.directories.dist)));

    if (buildConfiguration.minify) {
        streams.push(gulp.src(path.join(uniteConfig.directories.dist, "**/*.css"))
            .pipe(cssnano())
            .pipe(gulp.dest(uniteConfig.directories.cssDist)));
    }

    return asyncUtil.stream(merge(streams));
});

/* Generated by UniteJS */
