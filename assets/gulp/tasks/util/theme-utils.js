/**
 * Gulp utils for themes.
 */
const gulp = require("gulp");
const display = require("./display");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const fs = require("fs");
const util = require("util");
const path = require("path");
const os = require("os");
const exec = require("./exec");
const asyncUtil = require("./async-util");
const mkdirp = require("mkdirp");

async function fileExists (filename) {
    try {
        const stat = await util.promisify(fs.stat)(filename);
        return stat.isFile();
    } catch (err) {
        if (err.code !== "ENOENT") {
            display.error(`Error accessing '${filename}`, err);
            process.exit(1);
        }
        return false;
    }
}

function writeIndex (templateName, cacheBust, config, headers) {
    const formattedHeaders = headers.filter(header => header.trim().length > 0).join("\r\n        ");
    return asyncUtil.stream(gulp.src(templateName)
        .pipe(replace("{THEME}", `        ${formattedHeaders}`))
        .pipe(replace("{CACHEBUST}", cacheBust))
        .pipe(replace("{UNITECONFIG}", config))
        .pipe(rename("index.html"))
        .pipe(gulp.dest("./")));
}

function buildIndex (uniteConfig, uniteThemeConfig, buildConfiguration, packageJson) {
    const cacheBust = buildConfiguration.bundle ? `?v=${new Date().getTime()}` : "";

    const uniteJs = {
        "config": buildConfiguration.variables,
        "packageVersion": packageJson.version,
        "uniteVersion": uniteConfig.uniteVersion
    };

    const config = `window.unite = ${JSON.stringify(uniteJs)};`;

    let headers = [];

    if (uniteThemeConfig.metaDescription) {
        headers.push(`<meta name="description" content="${uniteThemeConfig.metaDescription}">`);
    }

    if (uniteThemeConfig.metaKeywords && uniteThemeConfig.metaKeywords.length > 0) {
        headers.push(`<meta name="keywords" content="${uniteThemeConfig.metaKeywords.join(",")}">`);
    }

    if (uniteThemeConfig.metaAuthor) {
        headers.push(`<meta name="author" content="${uniteThemeConfig.metaAuthor}">`);
    }

    if (uniteThemeConfig.themeHeaders && uniteThemeConfig.themeHeaders.length > 0) {
        headers = headers.concat(uniteThemeConfig.themeHeaders);
    }

    if (uniteThemeConfig.customHeaders && uniteThemeConfig.customHeaders.length > 0) {
        headers = headers.concat(uniteThemeConfig.customHeaders);
    }

    return writeIndex(buildConfiguration.bundle ? "./index-bundle.html" : "./index-no-bundle.html",
        cacheBust,
        config,
        headers);
}

async function buildBrowserConfig (uniteConfig, uniteThemeConfig) {
    const tileFilename = path.join(uniteConfig.directories.assets, "favicon/", "mstile-150x150.png");

    const tileExists = await fileExists(tileFilename);

    if (tileExists) {
        const bcFilename = path.join(uniteConfig.directories.assets, "favicon/", "browserconfig.xml");
        const browserConfig = [
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
            "<browserconfig>",
            "    <msapplication>",
            "        <tile>",
            "            <square150x150logo src=\"./assets/favicon/mstile-150x150.png\"/>"
        ];

        if (uniteThemeConfig.backgroundColor) {
            browserConfig.push(`            <TileColor>${uniteThemeConfig.backgroundColor}</TileColor>`);
        }
        browserConfig.push("        </tile>");
        browserConfig.push("    </msapplication>");
        browserConfig.push("</browserconfig>");

        try {
            await util.promisify(fs.writeFile)(bcFilename, browserConfig.join(os.EOL));
        } catch (err) {
            display.error(`Writing ${bcFilename}`, err);
            process.exit(1);
        }
    } else {
        display.info("Skipping Create as tile does not exist", tileFilename);
    }
}

async function buildManifestJson (uniteConfig, uniteThemeConfig) {
    const manifest = {
        "name": uniteConfig.title,
        "icons": [],
        "theme_color": uniteThemeConfig.themeColor,
        "background_color": uniteThemeConfig.backgroundColor,
        "display": "standalone"
    };

    const sizes = [192, 512];

    for (let i = 0; i < sizes.length; i++) {
        const fname = path.join(uniteConfig.directories.assets,
            "favicon/",
            `android-chrome-${sizes[i]}x${sizes[i]}.png`);

        const imageExists = await fileExists(fname);
        if (imageExists) {
            manifest.icons.push({
                "src": `./${fname.replace(/\\/g, "/")}`,
                "sizes": `${sizes[i]}x${sizes[i]}`,
                "type": "image/png"
            });
        }
    }

    const manifestFilename = path.join(uniteConfig.directories.assets, "favicon/", "manifest.json");

    try {
        await util.promisify(fs.writeFile)(manifestFilename, JSON.stringify(manifest, undefined, "\t"));
    } catch (err) {
        display.error(`Failed to write '${manifestFilename}`, err);
        process.exit(1);
    }
}


async function buildThemeHeaders (uniteConfig, uniteThemeConfig) {
    uniteThemeConfig.themeHeaders = [];

    const headers = [
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "apple-touch-icon.png"),
            "header": "<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"./assets/favicon/apple-touch-icon.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon-32x32.png"),
            "header": "<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" " +
            "href=\"./assets/favicon/favicon-32x32.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon-16x16.png"),
            "header": "<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" " +
            "href=\"./assets/favicon/favicon-16x16.png\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "manifest.json"),
            "header": "<link rel=\"manifest\" href=\"./assets/favicon/manifest.json\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "safari-pinned-tab.svg"),
            "header": "<link rel=\"mask-icon\" href=\"./assets/favicon/safari-pinned-tab.svg\" " +
            `color="${uniteConfig.themeColor}">`
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "favicon.ico"),
            "header": "<link rel=\"shortcut icon\" href=\"./assets/favicon/favicon.ico\">"
        },
        {
            "file": path.join(uniteConfig.directories.assets, "favicon/", "browserconfig.xml"),
            "header": "<meta name=\"msapplication-config\" content=\"./assets/favicon/browserconfig.xml\">"
        }
    ];

    if (uniteThemeConfig.themeColor) {
        uniteThemeConfig.themeHeaders.push(`<meta name="theme-color" content="${uniteThemeConfig.themeColor}">`);
    }

    for (let i = 0; i < headers.length; i++) {
        const headerFileExists = await fileExists(headers[i].file);
        if (headerFileExists) {
            uniteThemeConfig.themeHeaders.push(headers[i].header);
        }
    }
}

async function callUniteImage (config) {
    const params = [];

    params.push(config.command);

    for (const key in config) {
        params.push(`--${key}=${config[key]}`);
    }

    try {
        await exec.npmRun("unite-image", params);
    } catch (err) {
        display.error("Executing unite-image", err);
        process.exit(1);
    }
}

async function generateFavIcons (uniteConfig, uniteThemeConfig, favIconDirectory) {
    const images = [
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "android-chrome-192x192.png")}`,
            "width": 192,
            "height": 192,
            "marginX": 19,
            "marginY": 19,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "android-chrome-512x512.png")}`,
            "width": 512,
            "height": 512,
            "marginX": 51,
            "marginY": 51,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "apple-touch-icon.png")}`,
            "width": 180,
            "height": 180,
            "marginX": 18,
            "marginY": 18,
            "background": uniteThemeConfig.backgroundColor
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-70x70.png")}`,
            "width": 128,
            "height": 128,
            "marginX": 12,
            "marginY": 12
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-144x144.png")}`,
            "width": 144,
            "height": 144,
            "marginX": 14,
            "marginY": 14
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-150x150.png")}`,
            "width": 270,
            "height": 270,
            "marginX": 67,
            "marginY": 67
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-310x150.png")}`,
            "width": 558,
            "height": 270,
            "marginX": 140,
            "marginY": 67
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "mstile-310x310.png")}`,
            "width": 558,
            "height": 558,
            "marginX": 140,
            "marginY": 140
        },
        {
            "command": "svgToMask",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-tile.svg")}`,
            "destFile": `${path.join(favIconDirectory, "safari-pinned-tab.svg")}`
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-16x16.png")}`,
            "width": 16,
            "height": 16
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-32x32.png")}`,
            "width": 32,
            "height": 32
        },
        {
            "command": "svgToPng",
            "sourceFile": `${path.join(uniteConfig.directories.assetsSource, "theme", "logo-transparent.svg")}`,
            "destFile": `${path.join(favIconDirectory, "favicon-48x48.png")}`,
            "width": 48,
            "height": 48
        },
        {
            "command": "pngsToIco",
            "sourceFolder": favIconDirectory,
            "sourceFiles": "favicon-16x16.png,favicon-32x32.png,favicon-48x48.png",
            "destFile": `${path.join(favIconDirectory, "favicon.ico")}`
        }
    ];

    try {
        await util.promisify(mkdirp)(favIconDirectory);
    } catch (err) {
        display.error(`Creating ${favIconDirectory}`, err);
        process.exit(1);
    }

    for (let i = 0; i < images.length; i++) {
        await callUniteImage(images[i]);
    }
}

module.exports = {
    buildBrowserConfig,
    buildIndex,
    buildManifestJson,
    buildThemeHeaders,
    callUniteImage,
    generateFavIcons
};

/* Generated by UniteJS */
