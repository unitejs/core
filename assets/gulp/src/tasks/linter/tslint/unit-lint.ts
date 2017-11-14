/**
 * Gulp tasks for linting modules.
 */
import * as gulp from "gulp";
import * as tslint from "gulp-tslint";
import * as minimist from "minimist";
import * as path from "path";
import * as asyncUtil from "../../util/async-util";
import * as display from "../../util/display";
import * as uc from "../../util/unite-config";

gulp.task("unit-lint", async () => {
    display.info("Running", "TSLint");

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

    return asyncUtil.stream(gulp.src(path.join(
        uniteConfig.dirs.www.unitTestSrc,
        `**/${options.grep}.${uc.extensionMap(uniteConfig.sourceExtensions)}`
    ))
        .pipe(tslint({formatter: "verbose"}))
        .pipe(tslint.report({
            allowWarnings: true
        }))
        .on("error", () => {
            process.exit(1);
        }));
});

// Generated by UniteJS