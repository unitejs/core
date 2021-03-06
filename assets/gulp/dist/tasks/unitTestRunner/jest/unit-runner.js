/**
 * Gulp tasks for jest unit testing.
 */
const gulp = require("gulp");
const jest = require("jest-cli");
const minimist = require("minimist");
const display = require("../../util/display");
const uc = require("../../util/unite-config");
gulp.task("unit-run-test", async () => {
    display.info("Running", "Jest");
    const knownOptions = {
        default: {
            grep: "!(*-bundle|app-module-config|entryPoint)",
            browser: undefined,
            watch: false
        },
        string: [
            "grep",
            "browser"
        ],
        boolean: [
            "watch"
        ]
    };
    const options = minimist(process.argv.slice(2), knownOptions);
    if (options.browser !== undefined) {
        display.error("The browser argument is not available with Jest");
        process.exit(1);
    }
    if (options.watch) {
        display.error("The watch argument is not available with Jest");
        process.exit(1);
    }
    const uniteConfig = await uc.getUniteConfig();
    const conf = {
        collectCoverageFrom: [
            `${uniteConfig.dirs.www.dist.replace(/\.\//, "")}**/${options.grep}.js`
        ]
    };
    return new Promise((resolve, reject) => {
        jest.runCLI(conf, ["./jest.config.json"], (result) => {
            if (result.numFailedTests || result.numFailedTestSuites) {
                process.exit(1);
                reject();
            } else {
                resolve();
            }
        });
    });
});
// Generated by UniteJS
