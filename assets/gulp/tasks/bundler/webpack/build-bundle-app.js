/**
 * Gulp tasks for wrapping Webpack modules.
 */
const display = require("./util/display");
const gulp = require("gulp");
const path = require("path");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const uc = require("./util/unite-config");
const asyncUtil = require("./util/async-util");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const clientPackages = require("./util/client-packages");

gulp.task("build-bundle-app", async () => {
    const uniteConfig = await uc.getUniteConfig();

    const buildConfiguration = uc.getBuildConfiguration(uniteConfig);

    if (buildConfiguration.bundle) {
        display.info("Running", "Webpack for App");

        const entry = {};
        const plugins = [];

        const keys = clientPackages.getKeys(uniteConfig);

        const idx = keys.indexOf("systemjs");
        if (idx >= 0) {
            keys.splice(idx, 1);
        }

        if (keys.length > 0) {
            entry.vendor = keys;
        }
        plugins.push(new webpack.optimize.CommonsChunkPlugin({
            "filename": "vendor-bundle.js",
            "name": "vendor"
        }));

        if (buildConfiguration.minify) {
            plugins.push(new UglifyJSPlugin());
            process.env.NODE_ENV = "production";
        }

        entry.app = `./${path.join(uniteConfig.directories.dist, "entryPoint.js")}`;

        const webpackOptions = {
            entry,
            "output": {
                "devtoolModuleFilenameTemplate": "[resource-path]",
                "filename": "app-bundle.js"
            },
            plugins
        };

        if (buildConfiguration.sourcemaps) {
            webpackOptions.devtool = "inline-source-map";
            webpackOptions.module = {
                "rules": [
                    {
                        "enforce": "pre",
                        "loader": "source-map-loader",
                        "test": /\.js$/
                    }
                ]
            };
        }

        return asyncUtil.stream(gulp.src(entry.app)
            .pipe(webpackStream(webpackOptions, webpack))
            .pipe(gulp.dest(uniteConfig.directories.dist)));
    }
});

/* Generated by UniteJS */
