/**
 * Pipeline step to generate configuration for gulp.
 */
import { IDisplay } from "unitejs-framework/dist/interfaces/IDisplay";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../../engine/enginePipelineStepBase";
import { EngineVariables } from "../../engine/engineVariables";
export declare class Gulp extends EnginePipelineStepBase {
    private static FILENAME;
    process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    generateBuildTasks(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;
    private generateUnitTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
    private generateE2eTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
    private generateServeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
    private generateThemeTasks(logger, display, fileSystem, uniteConfiguration, engineVariables);
    private generateUtils(logger, display, fileSystem, uniteConfiguration, engineVariables);
}