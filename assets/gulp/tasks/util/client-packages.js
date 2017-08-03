/**
 * Gulp utils for client packages.
 */

function getKeys (uniteConfig) {
    const pathKeys = [];
    const keys = Object.keys(uniteConfig.clientPackages);

    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (pkg.includeMode === "app" || pkg.includeMode === "both") {
            pathKeys.push(keys[i]);
        }
    }

    return pathKeys;
}

function buildModuleConfig (uniteConfig, includeModes, isMinified) {
    const moduleConfig = {
        "paths": {},
        "packages": [],
        "preload": []
    };

    const keys = Object.keys(uniteConfig.clientPackages);
    for (let i = 0; i < keys.length; i++) {
        const pkg = uniteConfig.clientPackages[keys[i]];
        if (includeModes.indexOf(pkg.includeMode) >= 0) {
            const mainSplit = isMinified && pkg.mainMinified ? pkg.mainMinified.split("/") : pkg.main.split("/");
            const main = mainSplit.pop().replace(/(\.js)$/, "");
            let location = mainSplit.join("/");

            if (pkg.isPackage) {
                moduleConfig.packages.push({
                    "name": keys[i],
                    "location": `node_modules/${keys[i]}/${location}`,
                    main
                });
            } else {
                location += location.length > 0 ? "/" : "";
                moduleConfig.paths[keys[i]] = `node_modules/${keys[i]}/${location}${main}`;
            }

            if (pkg.preload) {
                moduleConfig.preload.push(keys[i]);
            }
        }
    }

    return moduleConfig;
}

module.exports = {
    buildModuleConfig,
    getKeys
};

/* Generated by UniteJS */
