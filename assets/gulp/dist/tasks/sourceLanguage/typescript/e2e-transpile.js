/**
 * Gulp tasks for e2e testing TypeScript.
 */
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");
const minimist = require("minimist");
const path = require("path");
const asyncUtil = require("../../util/async-util");
const display = require("../../util/display");
const errorUtil = require("../../util/error-util");
const uc = require("../../util/unite-config");
gulp.task("e2e-transpile", async () => {
    display.info("Running", "TypeScript");
    const knownOptions = {
        default: {
            grep: "*"
        },
        string: [
            "grep"
        ]
    };
    const options = minimist(process.argv.slice(2), knownOptions);
    const uniteConfig = await uc.getUniteConfig();
    const tsProject = typescript.createProject("tsconfig.json", {
        module: "commonjs"
    });
    let errorCount = 0;
    return asyncUtil.stream(gulp.src([
            path.join(uniteConfig.dirs.www.e2eTestSrc, `**/${options.grep}.spec.${uc.extensionMap(uniteConfig.sourceExtensions)}`),
            path.join(uniteConfig.dirs.www.e2eTestSrc, `**/!(*.spec).${uc.extensionMap(uniteConfig.sourceExtensions)}`)
        ])
        .pipe(sourcemaps.init())
        .pipe(tsProject(typescript.reporter.nullReporter()))
        .on("error", (err) => {
            display.error(err.message);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .js
        .pipe(sourcemaps.write({
            includeContent: true
        }))
        .pipe(gulp.dest(uniteConfig.dirs.www.e2eTestDist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});
// Generated by UniteJS
