/**
 * Pipeline step to generate unite.json.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class UniteConfigurationJson extends PipelineStepBase {
    private static FILENAME: string = "unite.json";

    public influences(): PipelineKey[] {
        return [];
    }

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            logger.info(`Generating ${UniteConfigurationJson.FILENAME} in`, { rootFolder: engineVariables.rootFolder });

            uniteConfiguration.uniteVersion = engineVariables.enginePackageJson.version;

            await fileSystem.fileWriteJson(engineVariables.rootFolder, UniteConfigurationJson.FILENAME, uniteConfiguration);
            return 0;
        } catch (err) {
            logger.error(`Generating ${UniteConfigurationJson.FILENAME} failed`, err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}