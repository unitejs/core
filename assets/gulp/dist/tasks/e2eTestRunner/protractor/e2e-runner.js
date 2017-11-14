/**
 * Gulp tasks for protractor e2e testing.
 */
const browserSync = require("browser-sync");
const gulp = require("gulp");
const minimist = require("minimist");
const util = require("util");
const display = require("../../util/display");
const exec = require("../../util/exec");
let browserSyncInstance = null;
gulp.task("e2e-run-test", async () => {
    display.info("Running", "Protractor");
    const knownOptions = {
        default: {
            browser: "chrome",
            secure: false,
            port: "9000"
        },
        string: [
            "browser",
            "port"
        ],
        boolean: [
            "secure"
        ]
    };
    const options = minimist(process.argv.slice(2), knownOptions);
    if (options.browser === "ie") {
        options.browser = "internet explorer";
    } else if (options.browser === "edge") {
        options.browser = "MicrosoftEdge";
    }
    let url = options.secure ? "https://" : "http://";
    url += "localhost:";
    url += options.port;
    try {
        await exec.npmRun("protractor", ["protractor.conf.js", `--browser=${options.browser}`, `--baseUrl=${url}`]);
        browserSyncInstance.exit();
    } catch (err) {
        display.error("Executing protractor", err);
        browserSyncInstance.exit();
        process.exit(1);
    }
});
gulp.task("e2e-serve", async () => {
    display.info("Running", "BrowserSync");
    const knownOptions = {
        default: {
            secure: false,
            port: "9000"
        },
        boolean: [
            "secure"
        ],
        string: [
            "port"
        ]
    };
    const options = minimist(process.argv.slice(2), knownOptions);
    browserSyncInstance = browserSync.create();
    const initAsync = util.promisify(browserSyncInstance.init);
    return initAsync({
        https: options.secure,
        notify: false,
        online: true,
        open: false,
        port: options.port,
        server: {
            baseDir: ["."]
        }
    });
});
// Generated by UniteJS
