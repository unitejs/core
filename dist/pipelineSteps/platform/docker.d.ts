/**
 * Pipeline step to generate docker platform configuration.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";
export declare class Docker extends PipelineStepBase {
    private static PLATFORM;
    private static FILENAME;
    mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined;
    finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number>;
}
