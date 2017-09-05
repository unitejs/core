/**
 * Pipeline step to generate handle sass styling.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class Sass extends PipelineStepBase {
    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson")
        ];
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        if (super.condition(uniteConfiguration.cssPre, "Sass")) {
            engineVariables.styleLanguageExt = "scss";
            engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "sass");
        }
        return 0;
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["node-sass"], super.condition(uniteConfiguration.cssPre, "Sass"));

        if (super.condition(uniteConfiguration.cssPre, "Sass")) {
            try {
                logger.info("Creating Sass folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);

                logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });

                await fileSystem.directoryCreate(engineVariables.www.cssDistFolder);

                return 0;
            } catch (err) {
                logger.error("Generating Sass folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                return 1;
            }
        }

        return 0;
    }
}
