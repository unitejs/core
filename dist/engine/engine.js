"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main engine
 */
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const appScaffold_1 = require("../pipelineSteps/appScaffold");
const babel_1 = require("../pipelineSteps/babel");
const chai_1 = require("../pipelineSteps/chai");
const e2eTestScaffold_1 = require("../pipelineSteps/e2eTestScaffold");
const gulpBuild_1 = require("../pipelineSteps/gulpBuild");
const gulpScaffold_1 = require("../pipelineSteps/gulpScaffold");
const gulpTasksBuild_1 = require("../pipelineSteps/gulpTasksBuild");
const gulpTasksUnit_1 = require("../pipelineSteps/gulpTasksUnit");
const gulpTasksUtil_1 = require("../pipelineSteps/gulpTasksUtil");
const htmlTemplate_1 = require("../pipelineSteps/htmlTemplate");
const jasmine_1 = require("../pipelineSteps/jasmine");
const karma_1 = require("../pipelineSteps/karma");
const mocha_1 = require("../pipelineSteps/mocha");
const moduleLoader_1 = require("../pipelineSteps/moduleLoader");
const outputDirectory_1 = require("../pipelineSteps/outputDirectory");
const packageJson_1 = require("../pipelineSteps/packageJson");
const typeScript_1 = require("../pipelineSteps/typeScript");
const uniteConfigurationJson_1 = require("../pipelineSteps/uniteConfigurationJson");
const unitTestScaffold_1 = require("../pipelineSteps/unitTestScaffold");
const engineValidation_1 = require("./engineValidation");
const engineVariables_1 = require("./engineVariables");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    init(packageName, title, sourceLanguage, moduleLoader, unitTestRunner, unitTestFramework, sourceMaps, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "title", title)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "sourceLanguage", sourceLanguage, ["JavaScript", "TypeScript"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "moduleLoader", moduleLoader, ["RequireJS", "Webpack", "Browserify", "JSPM"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestRunner", unitTestRunner, ["None", "Mocha", "Karma"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "unitTestFramework", unitTestFramework, ["Chai", "Jasmine"])) {
                return 1;
            }
            outputDirectory = this._fileSystem.pathFormat(outputDirectory);
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
                return 1;
            }
            this._logger.info("Engine::init", { packageName, sourceLanguage, moduleLoader, outputDirectory });
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            uniteConfiguration.packageName = packageName;
            uniteConfiguration.title = title;
            uniteConfiguration.sourceLanguage = sourceLanguage;
            uniteConfiguration.moduleLoader = moduleLoader;
            uniteConfiguration.sourceMaps = sourceMaps;
            uniteConfiguration.unitTestRunner = unitTestRunner;
            uniteConfiguration.unitTestFramework = unitTestFramework;
            uniteConfiguration.outputDirectory = outputDirectory;
            uniteConfiguration.staticClientModules = [];
            const engineVariables = new engineVariables_1.EngineVariables();
            engineVariables.requiredDependencies = [];
            engineVariables.requiredDevDependencies = [];
            engineVariables.assetsDirectory = "./node_modules/unitejs-core/dist/assets/";
            engineVariables.dependenciesFile = "unite-dependencies.json";
            engineVariables.sourceLanguageExt = uniteConfiguration.sourceLanguage === "JavaScript" ? "js" : "ts";
            const pipelineSteps = [];
            pipelineSteps.push(new outputDirectory_1.OutputDirectory());
            pipelineSteps.push(new appScaffold_1.AppScaffold());
            pipelineSteps.push(new unitTestScaffold_1.UnitTestScaffold());
            pipelineSteps.push(new e2eTestScaffold_1.E2eTestScaffold());
            pipelineSteps.push(new gulpScaffold_1.GulpScaffold());
            pipelineSteps.push(new gulpBuild_1.GulpBuild());
            pipelineSteps.push(new gulpTasksBuild_1.GulpTasksBuild());
            pipelineSteps.push(new gulpTasksUtil_1.GulpTasksUtil());
            pipelineSteps.push(new gulpTasksUnit_1.GulpTasksUnit());
            pipelineSteps.push(new moduleLoader_1.ModuleLoader());
            pipelineSteps.push(new htmlTemplate_1.HtmlTemplate());
            pipelineSteps.push(new babel_1.Babel());
            pipelineSteps.push(new typeScript_1.TypeScript());
            pipelineSteps.push(new mocha_1.Mocha());
            pipelineSteps.push(new karma_1.Karma());
            pipelineSteps.push(new chai_1.Chai());
            pipelineSteps.push(new jasmine_1.Jasmine());
            pipelineSteps.push(new uniteConfigurationJson_1.UniteConfigurationJson());
            pipelineSteps.push(new packageJson_1.PackageJson());
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    module(operation, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "operation", operation, ["add"])) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "name", name)) {
                return 1;
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
