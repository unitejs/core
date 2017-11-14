/**
 * Gulp tasks for unit testing TypeScript.
 */
import * as gulp from "gulp";
import * as replace from "gulp-replace";
import * as sourcemaps from "gulp-sourcemaps";
import * as typescript from "gulp-typescript";
import * as minimist from "minimist";
import * as path from "path";
import * as asyncUtil from "../../util/async-util";
import * as display from "../../util/display";
import * as errorUtil from "../../util/error-util";
import * as uc from "../../util/unite-config";

gulp.task("unit-transpile", async () => {
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

    const regEx = new RegExp(uniteConfig.srcDistReplace, "g");

    const tsProject = typescript.createProject("tsconfig.json");
    let errorCount = 0;

    return asyncUtil.stream(gulp.src([
        path.join(
            uniteConfig.dirs.www.unitTestSrc,
            `**/${options.grep}.spec.${uc.extensionMap(uniteConfig.sourceExtensions)}`
        ),
        path.join(
            uniteConfig.dirs.www.unitTestSrc,
            `**/*.mock.${uc.extensionMap(uniteConfig.sourceExtensions)}`
        ),
        path.join(
            uniteConfig.dirs.www.src,
            `customTypes/**/*.d.ts`
        )
    ])
        .pipe(sourcemaps.init())
        .pipe(tsProject(typescript.reporter.nullReporter()))
        .on("error", (err) => {
            display.error(err.message);
            errorCount++;
        })
        .on("error", errorUtil.handleErrorEvent)
        .js
        .pipe(replace(regEx, uniteConfig.srcDistReplaceWith))
        .pipe(sourcemaps.write({includeContent: true}))
        .pipe(gulp.dest(uniteConfig.dirs.www.unitTestDist))
        .on("end", () => {
            errorUtil.handleErrorCount(errorCount);
        }));
});

// Generated by UniteJS