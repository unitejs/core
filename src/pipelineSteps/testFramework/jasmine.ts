/**
 * Pipeline step to generate jasmine configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { KarmaConfiguration } from "../../configuration/models/karma/karmaConfiguration";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { WebdriverIoConfiguration } from "../../configuration/models/webdriverIo/webdriverIoConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Jasmine extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestFramework, "Jasmine") || super.condition(uniteConfiguration.e2eTestFramework, "Jasmine");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const isUnit = super.condition(uniteConfiguration.unitTestFramework, "Jasmine");
        const isE2E = super.condition(uniteConfiguration.e2eTestFramework, "Jasmine");

        engineVariables.toggleDevDependency(["jasmine-core"], mainCondition);
        engineVariables.toggleDevDependency(["@types/jasmine"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["karma-jasmine"], mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma") && isUnit);

        engineVariables.toggleDevDependency(["protractor-jasmine2-html-reporter", "jasmine-spec-reporter"],
                                            mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);

        engineVariables.toggleDevDependency(["wdio-jasmine-framework"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "jasmine", true, mainCondition);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "jasmine", mainCondition && isUnit);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            ObjectHelper.addRemove(protractorConfiguration, "framework", "jasmine", mainCondition && isE2E);
            ObjectHelper.addRemove(protractorConfiguration, "jasmineNodeOpts", { showColors: true }, mainCondition && isE2E);
        }

        const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
        if (webdriverIoConfiguration) {
            ObjectHelper.addRemove(webdriverIoConfiguration, "framework", "jasmine", mainCondition && isE2E);
        }

        if (isE2E) {
            const protractorScriptStart = engineVariables.getConfiguration<string[]>("Protractor.ScriptStart");
            if (protractorScriptStart) {
                protractorScriptStart.push("const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');");
                protractorScriptStart.push("const SpecReporter = require('jasmine-spec-reporter').SpecReporter;");
            }

            const protractorScriptEnd = engineVariables.getConfiguration<string[]>("Protractor.ScriptEnd");
            if (protractorScriptEnd) {
                const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));

                protractorScriptEnd.push("exports.config.jasmineNodeOpts.print = function() {};");
                protractorScriptEnd.push("exports.config.onPrepare = () => {");
                protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                protractorScriptEnd.push("        new Jasmine2HtmlReporter({");
                protractorScriptEnd.push(`            savePath: '${reportsFolder}/e2e/',`);
                protractorScriptEnd.push("            fileName: 'index'");
                protractorScriptEnd.push("        })");
                protractorScriptEnd.push("    );");
                protractorScriptEnd.push("    jasmine.getEnv().addReporter(");
                protractorScriptEnd.push("        new SpecReporter({");
                protractorScriptEnd.push("            displayStacktrace: 'all'");
                protractorScriptEnd.push("        })");
                protractorScriptEnd.push("    );");
                protractorScriptEnd.push("};");
            }
        }

        return 0;
    }
}
