/**
 * Pipeline step to generate scaffolding for plain application.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ProtractorConfiguration } from "../../configuration/models/protractor/protractorConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { SharedAppFramework } from "../sharedAppFramework";

export class PlainApp extends SharedAppFramework {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("content", "packageJson"),
            new PipelineKey("scaffold", "uniteConfigurationJson"),
            new PipelineKey("e2eTestRunner", "webdriverIo"),
            new PipelineKey("e2eTestRunner", "protractor")
        ];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const cond = super.condition(uniteConfiguration.applicationFramework, "PlainApp");

        engineVariables.toggleDevDependency(["unitejs-plain-protractor-plugin"],
                                            cond &&
                                            super.condition(uniteConfiguration.e2eTestRunner, "Protractor"));

        engineVariables.toggleDevDependency(["unitejs-plain-webdriver-plugin"],
                                            cond &&
                                            super.condition(uniteConfiguration.e2eTestRunner, "WebdriverIO"));

        const protractorConfiguration = engineVariables.getConfiguration<ProtractorConfiguration>("Protractor");
        if (protractorConfiguration) {
            const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder,
                                                                            fileSystem.pathCombine(engineVariables.www.packageFolder, "unitejs-plain-protractor-plugin")));
            ArrayHelper.addRemove(protractorConfiguration.plugins, { path: plugin }, cond, (object, item) => object.path === item.path);
        }
        const webdriverIoPlugins = engineVariables.getConfiguration<string[]>("WebdriverIO.Plugins");
        if (webdriverIoPlugins) {
            ArrayHelper.addRemove(webdriverIoPlugins, "unitejs-plain-webdriver-plugin", cond);
        }

        if (cond) {
            let ret = await this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint"]);

            if (ret === 0) {
                ret = await super.generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);

                if (ret === 0) {
                    ret = await this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"], true);

                    if (ret === 0) {
                        ret = await super.generateCss(logger, fileSystem, uniteConfiguration, engineVariables);
                    }
                }
            }

            return ret;
        }
        return 0;
    }
}
