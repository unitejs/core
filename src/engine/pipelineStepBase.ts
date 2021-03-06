/**
 * Base implementation of engine pipeline step.
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { TemplateHelper } from "../helpers/templateHelper";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { EngineVariables } from "./engineVariables";
import { MarkerState } from "./markerState";

export abstract class PipelineStepBase implements IPipelineStep {
    public static MARKER: string = "Generated by UniteJS";

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return undefined;
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        return 0;
    }

    public async configure(logger: ILogger,
                           fileSystem: IFileSystem,
                           uniteConfiguration: UniteConfiguration,
                           engineVariables: EngineVariables,
                           mainCondition: boolean): Promise<number> {
        return 0;
    }

    public async finalise(logger: ILogger,
                          fileSystem: IFileSystem,
                          uniteConfiguration: UniteConfiguration,
                          engineVariables: EngineVariables,
                          mainCondition: boolean): Promise<number> {
        return 0;
    }

    public async copyFile(logger: ILogger,
                          fileSystem: IFileSystem,
                          sourceFolder: string,
                          sourceFilename: string,
                          destFolder: string,
                          destFilename: string,
                          force: boolean,
                          noCreate: boolean,
                          replacements?: { [id: string]: string[] }): Promise<number> {
        const sourceFileExists = await fileSystem.fileExists(sourceFolder, sourceFilename);

        if (sourceFileExists) {
            const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, destFolder, destFilename);

            if (hasGeneratedMarker === "FileNotExist" && noCreate) {
                logger.info(`Skipping ${sourceFilename} as the no create flag is set`,
                            { from: sourceFolder, to: destFolder });
            } else if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || force) {
                logger.info(`Copying ${sourceFilename}`, { from: sourceFolder, to: destFolder });

                try {
                    // We recombine this as sometimes the filename contains more folders
                    const folderWithFile = fileSystem.pathCombine(destFolder, destFilename);
                    const folderOnly = fileSystem.pathGetDirectory(folderWithFile);
                    const dirExists = await fileSystem.directoryExists(folderOnly);
                    if (!dirExists) {
                        await fileSystem.directoryCreate(folderOnly);
                    }

                    let txt = await fileSystem.fileReadText(sourceFolder, sourceFilename);
                    txt = TemplateHelper.replaceSubstitutions(replacements, txt);
                    await fileSystem.fileWriteText(destFolder, destFilename, txt);
                } catch (err) {
                    logger.error(`Copying ${sourceFilename} failed`, err, { from: sourceFolder, to: destFolder });
                    return 1;
                }
            } else {
                logger.info(`Skipping ${sourceFilename} as it has no generated marker`,
                            { from: sourceFolder, to: destFolder });
            }
            return 0;
        } else {
            logger.error(`${sourceFilename} does not exist`,
                         { folder: sourceFolder, file: sourceFilename });
            return 1;
        }
    }

    public async folderToggle(logger: ILogger, fileSystem: IFileSystem, folder: string, force: boolean, mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            return this.folderCreate(logger, fileSystem, folder);
        } else {
            return this.folderDelete(logger, fileSystem, folder, force);
        }
    }

    public async folderCreate(logger: ILogger, fileSystem: IFileSystem, folder: string): Promise<number> {
        logger.info(`Creating Folder`, { folder });

        try {
            await fileSystem.directoryCreate(folder);
        } catch (err) {
            logger.error(`Creating Folder ${folder} failed`, err);
            return 1;
        }

        return 0;
    }

    public async folderDelete(logger: ILogger, fileSystem: IFileSystem, folder: string, force: boolean): Promise<number> {
        try {
            const exists = await fileSystem.directoryExists(folder);

            if (exists) {
                logger.info(`Deleting Folder ${folder}`);
                if (force) {
                    await fileSystem.directoryDelete(folder);
                } else {
                    const hasRemaining = await this.internalDeleteFolder(logger, fileSystem, folder);

                    if (hasRemaining > 0) {
                        logger.warning(`Partial Delete of folder ${folder} as there are modified files with no generated marker`);
                    } else {
                        await fileSystem.directoryDelete(folder);
                    }
                }
            } else {
                return 0;
            }
        } catch (err) {
            logger.error(`Deleting Folder ${folder} failed`, err);
            return 1;
        }

        return 0;
    }

    public wrapGeneratedMarker(before: string, after: string): string {
        return before + PipelineStepBase.MARKER + after;
    }

    public async fileHasGeneratedMarker(fileSystem: IFileSystem, folder: string, filename: string): Promise<MarkerState> {
        let markerState: MarkerState = "FileNotExist";

        try {
            const exists = await fileSystem.fileExists(folder, filename);
            if (exists) {
                const existingLines = await fileSystem.fileReadLines(folder, filename);
                // Test the last few lines in case there are line breaks
                let hasMarker = false;
                const markerLower = PipelineStepBase.MARKER.toLowerCase();

                for (let i = existingLines.length - 1; i >= 0 && i >= existingLines.length - 5 && !hasMarker; i--) {
                    hasMarker = existingLines[i].toLowerCase()
                                                .indexOf(markerLower) >= 0;
                }

                markerState = hasMarker ? "HasMarker" : "NoMarker";
            }
            return markerState;
        } catch (err) {
            return markerState;
        }
    }

    public async fileReadJson<T>(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, jsonCallback: (obj: T) => Promise<number>): Promise<number> {
        if (!force) {
            try {
                const exists = await fileSystem.fileExists(folder, filename);
                if (exists) {
                    logger.info(`Reading existing ${filename} from `, { folder });
                    const obj = await fileSystem.fileReadJson<T>(folder, filename);
                    return jsonCallback(obj);
                } else {
                    return jsonCallback(undefined);
                }
            } catch (err) {
                logger.error(`Reading existing ${filename} failed`, err);
                return 1;
            }
        } else {
            return jsonCallback(undefined);
        }
    }

    public async fileReadText(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, textCallback: (text: string) => Promise<number>): Promise<number> {
        if (!force) {
            try {
                const exists = await fileSystem.fileExists(folder, filename);
                if (exists) {
                    logger.info(`Reading existing ${filename} from `, { folder });
                    const text = await fileSystem.fileReadText(folder, filename);
                    return textCallback(text);
                } else {
                    return textCallback(undefined);
                }
            } catch (err) {
                logger.error(`Reading existing ${filename} failed`, err);
                return 1;
            }
        } else {
            return textCallback(undefined);
        }
    }

    public async fileReadLines(logger: ILogger, fileSystem: IFileSystem, folder: string, filename: string, force: boolean, linesCallback: (lines: string[]) => Promise<number>): Promise<number> {
        if (!force) {
            try {
                const exists = await fileSystem.fileExists(folder, filename);
                if (exists) {
                    logger.info(`Reading existing ${filename} from `, { folder });
                    const readLines = await fileSystem.fileReadLines(folder, filename);
                    return linesCallback(readLines);
                } else {
                    return linesCallback([]);
                }
            } catch (err) {
                logger.error(`Reading existing ${filename} failed`, err);
                return 1;
            }
        } else {
            return linesCallback([]);
        }
    }

    public async fileToggleLines(logger: ILogger,
                                 fileSystem: IFileSystem,
                                 folder: string,
                                 filename: string,
                                 force: boolean,
                                 mainCondition: boolean,
                                 linesGenerator: () => Promise<string[]>): Promise<number> {

        if (mainCondition) {
            return this.fileWriteLines(logger, fileSystem, folder, filename, force, linesGenerator);
        } else {
            return this.fileDeleteLines(logger, fileSystem, folder, filename, force);
        }
    }

    public async fileToggleText(logger: ILogger,
                                fileSystem: IFileSystem,
                                folder: string,
                                filename: string,
                                force: boolean,
                                mainCondition: boolean,
                                textGenerator: () => Promise<string>): Promise<number> {
        if (mainCondition) {
            return this.fileWriteText(logger, fileSystem, folder, filename, force, textGenerator);
        } else {
            return this.fileDeleteText(logger, fileSystem, folder, filename, force);
        }
    }

    public async fileToggleJson(logger: ILogger,
                                fileSystem: IFileSystem,
                                folder: string,
                                filename: string,
                                force: boolean,
                                mainCondition: boolean,
                                jsonGenerator: () => Promise<any>): Promise<number> {
        if (mainCondition) {
            return this.fileWriteJson(logger, fileSystem, folder, filename, force, jsonGenerator);
        } else {
            return this.fileDeleteJson(logger, fileSystem, folder, filename, force);
        }
    }

    public async fileWriteLines(logger: ILogger,
                                fileSystem: IFileSystem,
                                folder: string,
                                filename: string,
                                force: boolean,
                                linesGenerator: () => Promise<string[]>): Promise<number> {
        try {
            const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, folder, filename);

            if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || force) {
                logger.info(`Writing ${filename} in `, { folder });

                const lines: string[] = await linesGenerator();
                await fileSystem.fileWriteLines(folder, filename, lines);
            } else {
                logger.info(`Skipping ${filename} as it has no generated marker`);
            }
        } catch (err) {
            logger.error(`Writing ${filename} failed`, err);
            return 1;
        }
        return 0;
    }

    public async fileWriteText(logger: ILogger,
                               fileSystem: IFileSystem,
                               folder: string,
                               filename: string,
                               force: boolean,
                               textGenerator: () => Promise<string>): Promise<number> {
        try {
            logger.info(`Writing ${filename} in `, { folder });

            const text: string = await textGenerator();
            await fileSystem.fileWriteText(folder, filename, text);
        } catch (err) {
            logger.error(`Writing ${filename} failed`, err);
            return 1;
        }
        return 0;
    }

    public async fileWriteJson(logger: ILogger,
                               fileSystem: IFileSystem,
                               folder: string,
                               filename: string,
                               force: boolean,
                               jsonGenerator: () => Promise<any>): Promise<number> {
        try {
            logger.info(`Writing ${filename} in `, { folder });

            const obj = await jsonGenerator();
            await fileSystem.fileWriteJson(folder, filename, obj);
        } catch (err) {
            logger.error(`Writing ${filename} failed`, err);
            return 1;
        }
        return 0;
    }

    public async fileDeleteText(logger: ILogger, fileSystem: IFileSystem,
                                folder: string, filename: string, force: boolean): Promise<number> {
        const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, folder, filename);

        if (hasGeneratedMarker === "HasMarker" || (hasGeneratedMarker !== "FileNotExist" && force)) {
            try {
                logger.info(`Deleting ${filename}`, { from: folder });
                await fileSystem.fileDelete(folder, filename);
                return 0;
            } catch (err) {
                logger.error(`Deleting ${filename} failed`, err);
                return 1;
            }
        } else if (hasGeneratedMarker === "NoMarker") {
            logger.warning(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
            return 0;
        } else {
            return 0;
        }
    }

    public async fileDeleteLines(logger: ILogger, fileSystem: IFileSystem,
                                 folder: string, filename: string, force: boolean): Promise<number> {
        const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, folder, filename);

        if (hasGeneratedMarker === "HasMarker" || (hasGeneratedMarker !== "FileNotExist" && force)) {
            try {
                logger.info(`Deleting ${filename}`, { from: folder });
                await fileSystem.fileDelete(folder, filename);
                return 0;
            } catch (err) {
                logger.error(`Deleting ${filename} failed`, err);
                return 1;
            }
        } else if (hasGeneratedMarker === "NoMarker") {
            logger.warning(`Skipping Delete of ${filename} as it has no generated marker`, { from: folder });
            return 0;
        } else {
            return 0;
        }
    }

    public async fileDeleteJson(logger: ILogger, fileSystem: IFileSystem,
                                folder: string, filename: string, force: boolean): Promise<number> {
        try {
            const exists = await fileSystem.fileExists(folder, filename);
            if (exists) {
                logger.info(`Deleting ${filename}`, { from: folder });
                await fileSystem.fileDelete(folder, filename);
            }
            return 0;
        } catch (err) {
            logger.error(`Deleting ${filename} failed`, err);
            return 1;
        }
    }

    public condition(uniteConfigurationKey: string, value: string): boolean {
        return uniteConfigurationKey !== undefined &&
            uniteConfigurationKey !== null &&
            value !== undefined &&
            value !== null &&
            uniteConfigurationKey.toLowerCase() === value.toLowerCase();
    }

    public objectCondition(uniteConfigurationObject: any, value: string): boolean {
        return uniteConfigurationObject !== undefined &&
            uniteConfigurationObject !== null &&
            value !== undefined &&
            value !== null &&
            Object.keys(uniteConfigurationObject)
                .map(key => key.toLowerCase())
                .indexOf(value.toLowerCase()) >= 0;
    }

    public arrayCondition(uniteConfigurationArray: string[], value: string): boolean {
        return uniteConfigurationArray !== undefined &&
            uniteConfigurationArray !== null &&
            value !== undefined &&
            value !== null &&
            uniteConfigurationArray
                .map(key => key.toLowerCase())
                .indexOf(value.toLowerCase()) >= 0;
    }

    public async internalDeleteFolder(logger: ILogger, fileSystem: IFileSystem,
                                      folder: string): Promise<number> {
        let remaining = 0;

        const subDirs = await fileSystem.directoryGetFolders(folder);
        for (let i = 0; i < subDirs.length; i++) {
            const subDir = fileSystem.pathCombine(folder, subDirs[i]);
            const dirRemaining = await this.internalDeleteFolder(logger, fileSystem, subDir);

            if (dirRemaining === 0) {
                await fileSystem.directoryDelete(subDir);
            } else {
                remaining += dirRemaining;
            }
        }

        const files = await fileSystem.directoryGetFiles(folder);
        for (let i = 0; i < files.length; i++) {
            const hasGeneratedMarker = await this.fileHasGeneratedMarker(fileSystem, folder, files[i]);

            if (hasGeneratedMarker === "NoMarker") {
                remaining++;
            } else {
                await fileSystem.fileDelete(folder, files[i]);
            }
        }

        return remaining;
    }
}
