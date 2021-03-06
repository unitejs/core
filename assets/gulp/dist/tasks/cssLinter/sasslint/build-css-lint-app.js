/**
 * Gulp tasks for linting app with sass lint.
 */
const gulp = require("gulp");
const sassLint = require("gulp-sass-lint");
const path = require("path");
const streamToPromise = require("stream-to-promise");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("build-css-lint-app", async () => {
    display.info("Running", "SassLint for App");
    const uniteConfig = await uc.getUniteConfig();
    return streamToPromise(gulp.src(path.join(uniteConfig.dirs.www.cssSrc, `**/*.${uniteConfig.styleExtension}`))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .on("error", (err) => {
            display.error("SassLint failed", err);
            process.exit(1);
        }));
});
// Generated by UniteJS
