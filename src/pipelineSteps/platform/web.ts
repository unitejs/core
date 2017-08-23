/**
 * Pipeline step to generate web platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";

export class Web extends EnginePipelineStepBase {
    public static PLATFORM: string = "Web";
    private static FILENAME: string = "platform-web.js";

    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["archiver"], uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Web.PLATFORM] !== undefined);

        const buildTasks = fileSystem.pathCombine(engineVariables.www.buildFolder, "/tasks/");
        if (uniteConfiguration.taskManager === "Gulp" && uniteConfiguration.platforms[Web.PLATFORM] !== undefined) {
            const assetTasksPlatform = fileSystem.pathCombine(engineVariables.engineAssetsFolder, "gulp/tasks/platform/");
            return await this.copyFile(logger, fileSystem, assetTasksPlatform, Web.FILENAME, buildTasks, Web.FILENAME);
        } else {
            return await super.deleteFile(logger, fileSystem, buildTasks, Web.FILENAME);
        }
    }
}