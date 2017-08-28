/**
 * Gulp utils for CommonJS module configuration.
 */
const os = require("os");
const clientPackages = require("./client-packages");

function create (uniteConfig, includeModes, isBundle, mapBase) {
    /* We use the SystemJS loader for CommonJS modules when testing and unbundled, 
    we need to specify the module format as cjs for it to work */
    const moduleConfig = clientPackages.buildModuleConfig(uniteConfig, includeModes, isBundle);

    const sjsConfig = {
        "paths": moduleConfig.paths,
        "packages": {},
        "map": { },
        "meta": {
            "dist/*": {
                "format": "cjs"
            }
        }
    };

    sjsConfig.packages[""] = {"defaultExtension": "js"};

    Object.keys(moduleConfig.paths).forEach(key => {
        moduleConfig.paths[key] = moduleConfig.paths[key].replace(/\.\//, "");
    });
    Object.keys(moduleConfig.map).forEach(key => {
        moduleConfig.map[key] = moduleConfig.map[key].replace(/\.\//, mapBase);
    });
    moduleConfig.packages.forEach((pkg) => {
        moduleConfig.paths[pkg.name] = pkg.location.replace(/\.\//, "");
        sjsConfig.packages[pkg.name] = {
            "main": pkg.main
        };
    });
    Object.keys(moduleConfig.map).forEach(key => {
        sjsConfig.map[key] = moduleConfig.map[key];
    });
    Object.keys(moduleConfig.loaders).forEach(key => {
        sjsConfig.meta[key] = {"loader": moduleConfig.loaders[key]};
    });

    const jsonConfig = JSON.stringify(sjsConfig, undefined, "\t");
    const jsonPreload = JSON.stringify(moduleConfig.preload, undefined, "\t");

    let config = `SystemJS.config(${jsonConfig});${os.EOL}`;
    config += `preloadModules = ${jsonPreload};${os.EOL}`;

    return config;
}

module.exports = {
    create
};

/* Generated by UniteJS */
