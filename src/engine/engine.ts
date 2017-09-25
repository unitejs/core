/**
 * Main engine
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { PackageConfiguration } from "../configuration/models/packages/packageConfiguration";
import { IEngine } from "../interfaces/IEngine";
import { IEngineCommand } from "../interfaces/IEngineCommand";
import { IEngineCommandParams } from "../interfaces/IEngineCommandParams";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _engineRootFolder: string;
    private _enginePackageJson: PackageConfiguration;

    public constructor(logger: ILogger, fileSystem: IFileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }

    public async initialise(): Promise<number> {
        try {
            this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");

            this._enginePackageJson = await this._fileSystem.fileReadJson<PackageConfiguration>(this._engineRootFolder, "package.json");

            return 0;
        } catch (err) {
            this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
            return 1;
        }
    }

    public version(): string {
        return this._enginePackageJson ? this._enginePackageJson.version : "unknown";
    }

    public async command<T extends IEngineCommandParams>(commandName: string, args: T): Promise<number> {
        try {
            // We disable the linting as we are trying to dynamically load modules
            // tslint:disable:no-require-imports
            // tslint:disable:non-literal-require
            const commandFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/commands/");
            const loadFile = this._fileSystem.pathCombine(commandFolder, `${commandName}Command.js`);
            const module = require(loadFile);
            // tslint:enable:no-require-imports
            // tslint:enable:non-literal-require

            const className = Object.keys(module)[0];

            const instance = Object.create(module[className].prototype);
            const engineCommand: IEngineCommand<T> = new instance.constructor();

            engineCommand.create(this._logger, this._fileSystem, this._engineRootFolder, this._enginePackageJson);
            args.outputDirectory = await this.findConfigFolder(args.outputDirectory);
            return engineCommand.run(args);
        } catch (err) {
            this._logger.error("Error loading command module", undefined, { command: commandName, args });
            return 1;
        }
    }

    private async findConfigFolder(outputDirectory: string | null | undefined): Promise<string> {
        let outputDir;
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            outputDir = this._fileSystem.pathAbsolute("./");
        } else {
            outputDir = this._fileSystem.pathAbsolute(outputDirectory);
        }

        // check to see if this folder contains unite.json if it doesn't then keep recursing up
        // until we find it
        let searchComplete = false;
        do {
            searchComplete = await this._fileSystem.fileExists(outputDir, "unite.json");

            if (!searchComplete) {
                const newOutputDir = this._fileSystem.pathCombine(outputDir, "../");

                // recursing up didn't move so we have reached the end of our search
                if (newOutputDir === outputDir) {
                    searchComplete = true;
                } else {
                    outputDir = newOutputDir;
                }
            }
        }
        while (!searchComplete);

        return outputDir;
    }
}
