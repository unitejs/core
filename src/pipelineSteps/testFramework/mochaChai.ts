/**
 * Pipeline step to generate mocha configuration.
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

export class MochaChai extends PipelineStepBase {
    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables) : boolean | undefined {
        return super.condition(uniteConfiguration.unitTestFramework, "MochaChai") || super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        const isUnit = super.condition(uniteConfiguration.unitTestFramework, "MochaChai");
        const isE2E = super.condition(uniteConfiguration.e2eTestFramework, "MochaChai");

        engineVariables.toggleDevDependency(["mocha"], mainCondition);
        engineVariables.toggleDevDependency(["@types/mocha", "@types/chai"], mainCondition && super.condition(uniteConfiguration.sourceLanguage, "TypeScript"));

        engineVariables.toggleDevDependency(["karma-mocha", "karma-chai"], mainCondition && super.condition(uniteConfiguration.unitTestRunner, "Karma") && isUnit);

        engineVariables.toggleDevDependency(["mochawesome-screenshots"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "Protractor") && isE2E);

        engineVariables.toggleDevDependency(["wdio-mocha-framework"], mainCondition && super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO") && isE2E);

        engineVariables.toggleClientPackage("chai", {
                                                name: "chai",
                                                main: "chai.js",
                                                preload: true,
                                                includeMode: "test"
                                            },
                                            mainCondition);

        const esLintConfiguration = engineVariables.getConfiguration<EsLintConfiguration>("ESLint");
        if (esLintConfiguration) {
            ObjectHelper.addRemove(esLintConfiguration.env, "mocha", true, mainCondition);
        }

        const karmaConfiguration = engineVariables.getConfiguration<KarmaConfiguration>("Karma");
        if (karmaConfiguration) {
            ArrayHelper.addRemove(karmaConfiguration.frameworks, "mocha", mainCondition && isUnit);
        }

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            ObjectHelper.addRemove(protractorConfiguration, "framework", "mocha", mainCondition && isE2E);

            const reportsFolder = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, engineVariables.www.reports));

            ObjectHelper.addRemove(protractorConfiguration, "mochaOpts", {
                                        reporter: "mochawesome-screenshots",
                                        reporterOptions: {
                                            reportDir: `${reportsFolder}/e2e/`,
                                            reportName: "index",
                                            takePassedScreenshot: true
                                        },
                                        timeout: 10000
                                    },
                                   mainCondition && isE2E);
        }

        const webdriverIoConfiguration = engineVariables.getConfiguration<WebdriverIoConfiguration>("WebdriverIO");
        if (webdriverIoConfiguration) {
            ObjectHelper.addRemove(webdriverIoConfiguration, "framework", "mocha", mainCondition && isE2E);
        }

        return 0;
    }
}
