/**
 * Gulp utils for exec.
 */
const child = require("child_process");
const path = require("path");
const display = require("./display");

function npmRun (packageName, args) {
    return new Promise((resolve, reject) => {
        const winExt = (/^win/).test(process.platform) ? ".cmd" : "";

        const spawnProcess = child.spawn(path.join("node_modules", ".bin", packageName) + winExt, args);

        spawnProcess.stdout.on("data", (data) => {
            process.stdout.write(data);
        });

        spawnProcess.stderr.on("data", (data) => {
            process.stderr.write(data);
        });

        spawnProcess.on("error", (err) => {
            reject(err);
        });

        spawnProcess.on("close", (exitCode) => {
            if (exitCode === 0) {
                resolve();
            } else {
                reject(new Error(`Exited with code ${exitCode}`));
            }
        });
    });
}

function launch (command, args, cwd) {
    display.info("Running", `${command} ${args.join(" ")}`);
    return new Promise((resolve, reject) => {
        let finalData = "";

        const spawnProcess = child.spawn(command, args, {cwd});

        spawnProcess.stdout.on("data", (data) => {
            finalData += data;
            process.stdout.write(data);
        });

        spawnProcess.stderr.on("data", (data) => {
            finalData += data;
            process.stderr.write(data);
        });

        spawnProcess.on("error", (err) => {
            finalData += err;
            reject(err);
        });

        spawnProcess.on("close", (exitCode) => {
            if (exitCode === 0) {
                resolve(finalData);
            } else {
                reject(new Error(`Exited with code ${exitCode}`));
            }
        });
    });
}

module.exports = {
    launch,
    npmRun
};

/* Generated by UniteJS */
