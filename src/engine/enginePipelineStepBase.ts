/**
 * Base implementation of engine pipeline step.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { ErrorHandler } from "../core/errorHandler";
import { IDisplay } from "../interfaces/IDisplay";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { EngineVariables } from "./engineVariables";

export abstract class EnginePipelineStepBase implements IEnginePipelineStep {
    public abstract process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number>;

    public log(logger: ILogger, display: IDisplay, message: string, args: { [id: string]: any}): void {
        const objKeys = Object.keys(args);
        display.log(message + ": " + (objKeys.length === 0 ? "" : (objKeys.length === 1 ? args[objKeys[0]] : JSON.stringify(args))));
        logger.log(message, args);
    }

    public error(logger: ILogger, display: IDisplay, message: string, err: any, args: { [id: string]: any}): void {
        display.error(message + ": " + ErrorHandler.format(err));
        logger.exception(message, err, args);
    }
}
