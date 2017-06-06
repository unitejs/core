var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ''));
    }
});

var paths = {};
var packages = {
    '': {
        defaultExtension: 'js'
    }
};

{REQUIRE_PATHS}
{REQUIRE_PACKAGES}
require.config({
    baseUrl: '/base/',
    paths: paths,
    packages: packages
});

SystemJS.import("bluebird", function () {
    Promise.all(allTestFiles.map(function(module) { return SystemJS.import(module) })).then(function(modules) {
        window.__karma__.start();
    });
});

