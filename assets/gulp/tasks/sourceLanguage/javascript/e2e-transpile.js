/**
 * Gulp tasks for e2e testing JavaScript.
 */
const display = require("./util/display");
const uc = require("./util/unite-config");
const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const asyncUtil = require("./util/async-util");

gulp.task("e2e-transpile", async () => {
    display.info("Running", "Babel");

    const uniteConfig = await uc.getUniteConfig();

    let errorCount = 0;

    return asyncUtil.stream(gulp.src(`${uniteConfig.directories.e2eTestSrc}**/*.spec.{js,jsx}`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            "babelrc": false,
            "presets": [
                [
                    "es2015",
                    {"modules": "commonjs"}
                ]
            ]
        }))
        .on("error", (err) => {
            display.error(`error: ${err.message}\n`);
            display.error(err.codeFrame);
            errorCount++;
        })
        .pipe(sourcemaps.write({"includeContent": true}))
        .pipe(gulp.dest(uniteConfig.directories.e2eTestDist))
        .on("end", () => {
            if (errorCount > 0) {
                process.exit();
            }
        }));
});

/* Generated by UniteJS */