import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "./engineVariables";
import { Pipeline } from "./pipeline";
export declare abstract class EngineCommandBase {
    protected _logger: ILogger;
    protected _fileSystem: IFileSystem;
    protected _engineRootFolder: string;
    protected _engineVersion: string;
    protected _engineDependencies: {
        [id: string]: string;
    };
    protected _engineAssetsFolder: string;
    protected _pipeline: Pipeline;
    create(logger: ILogger, fileSystem: IFileSystem, engineRootFolder: string, engineVersion: string, engineDependencies: {
        [id: string]: string;
    }): void;
    protected loadConfiguration(outputDirectory: string, profileSource: string, profile: string | undefined | null, force: boolean): Promise<UniteConfiguration | undefined | null>;
    protected loadProfile<T>(module: string, location: string, profileFile: string, profile: string | undefined | null): Promise<T | undefined | null>;
    protected createEngineVariables(outputDirectory: string, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): void;
    protected mapParser(input: string[]): {
        [id: string]: string;
    };
    protected mapFromArrayParser(input: string[]): {
        [id: string]: string;
    };
    protected displayCompletionMessage(engineVariables: EngineVariables, showPackageUpdate: boolean): void;
}
