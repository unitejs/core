/**
 * Class for pipeline
 */
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { IPipelineStep } from "../interfaces/IPipelineStep";
import { EngineVariables } from "./engineVariables";
import { PipelineKey } from "./pipelineKey";

export class Pipeline {
    private _logger: ILogger;
    private _fileSystem: IFileSystem;
    private _pipelineStepFolder: string;

    private _steps: PipelineKey[];
    private _moduleIdMap: { [id: string]: string };
    private _loadedStepCache: { [id: string]: IPipelineStep };

    constructor(logger: ILogger, fileSystem: IFileSystem, pipelineStepFolder: string) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._pipelineStepFolder = pipelineStepFolder;
        this._steps = [];
        this._moduleIdMap = {};
        this._loadedStepCache = {};
    }

    public add(category: string, key: string): void {
        this._steps.push(new PipelineKey(category, key));
    }

    public async run(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        const keyMap: { [id: string]: IPipelineStep } = {};

        for (const pipelineStep of this._steps) {
            const exists = await this.tryLoad(uniteConfiguration, pipelineStep, undefined, false);

            if (exists) {
                keyMap[pipelineStep.combined()] = this.getStep(pipelineStep);
            } else {
                return 1;
            }
        }

        const pipeline: IPipelineStep[] = this.orderByInfluence(keyMap);

        for (const pipelineStep of pipeline) {
            const ret = await pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        for (const pipelineStep of pipeline) {
            const ret = await pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }

    public getStep<T extends IPipelineStep>(pipelineKey: PipelineKey): T {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0 &&
            pipelineKey.key !== undefined && pipelineKey.key !== null && pipelineKey.key.length > 0) {
            const combinedKey = pipelineKey.combined();
            if (this._loadedStepCache[combinedKey] === undefined) {
                const mappedName = this._moduleIdMap[combinedKey];
                if (mappedName !== undefined && this._loadedStepCache[mappedName] !== undefined) {
                    return <T>this._loadedStepCache[mappedName];
                }
            } else {
                return <T>this._loadedStepCache[combinedKey];
            }
        }

        return undefined;
    }

    public async tryLoad(uniteConfiguration: UniteConfiguration, pipelineKey: PipelineKey, configurationType?: string, defineProperty: boolean = true): Promise<boolean> {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0) {

            const moduleTypeId = pipelineKey.combined();
            let className = this._moduleIdMap[moduleTypeId];

            if (className === undefined) {
                const moduleTypeFolder = this._fileSystem.pathCombine(this._pipelineStepFolder, pipelineKey.category);
                const actualType = configurationType ? configurationType : pipelineKey.category;

                try {
                    let files = await this._fileSystem.directoryGetFiles(moduleTypeFolder);
                    files = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));

                    if (pipelineKey.key === undefined || pipelineKey.key === null || pipelineKey.key.length === 0) {
                        this._logger.error(`${actualType} should not be blank, possible options could be [${files.join(", ")}]`);
                        return false;
                    } else {
                        const moduleIdLower = pipelineKey.key.toLowerCase();
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].toLowerCase() === moduleIdLower) {
                                // tslint:disable:no-require-imports
                                // tslint:disable:non-literal-require
                                const loadFile = this._fileSystem.pathCombine(moduleTypeFolder, files[i]);
                                const module = require(loadFile);
                                // tslint:enable:no-require-imports
                                // tslint:enable:non-literal-require

                                className = Object.keys(module)[0];

                                const instance = Object.create(module[className].prototype);

                                if (defineProperty) {
                                    this._logger.info(actualType, { className });
                                    Object.defineProperty(uniteConfiguration, actualType, { value: className });
                                }

                                const moduleClassName = new PipelineKey(pipelineKey.category, className).combined();
                                this._loadedStepCache[moduleClassName] = new instance.constructor();
                                this._moduleIdMap[moduleTypeId] = moduleClassName;
                                return true;
                            }
                        }
                        this._logger.error(`Pipeline Step ${pipelineKey.key} for arg ${actualType} could not be located, possible options could be [${files.join(", ")}]`);
                        return false;
                    }
                } catch (err) {
                    this._logger.error(`Pipeline Step ${pipelineKey.key} for arg ${actualType} failed to load`, err);
                    return false;
                }
            } else {
                return true;
            }
        } else {
            this._logger.error(`Pipeline Step has an invalid key`, undefined, pipelineKey);
            return false;
        }
    }

    public orderByInfluence(keyMap: { [id: string]: IPipelineStep }): IPipelineStep[] {
        const orderedKeys: PipelineKey[] = [];

        Object.keys(keyMap).sort().forEach(keyString => {
            const keyParts = keyString.split("/");
            const key = new PipelineKey(keyParts[0], keyParts[1]);
            orderedKeys.push(key);
        });

        let changed;
        do {
            changed = false;
            for (let i = 0; i < orderedKeys.length && !changed; i++) {
                const orderedKey = orderedKeys[i];
                const pipelineStep = keyMap[orderedKey.combined()];
                const influences = pipelineStep.influences();

                let lastInfluenceIndex = -1;

                influences.forEach(influence => {
                    let influenceIndex;

                    if (influence.key === "*") {
                        const allCatKeys = orderedKeys.filter(matchKey => matchKey.category === influence.category);
                        if (allCatKeys.length > 0) {
                            const lastCatKey = allCatKeys[allCatKeys.length - 1];
                            influenceIndex = orderedKeys.findIndex(matchKey => matchKey.matches(lastCatKey));
                        } else {
                            influenceIndex = -1;
                        }
                    } else {
                        influenceIndex = orderedKeys.findIndex(matchKey => matchKey.matches(influence));
                    }

                    lastInfluenceIndex = Math.max(lastInfluenceIndex, influenceIndex);
                });

                if (i < lastInfluenceIndex && lastInfluenceIndex !== -1) {
                    orderedKeys.splice(i, 1);
                    orderedKeys.splice(lastInfluenceIndex, 0, orderedKey);
                    changed = true;
                }
            }
        } while (changed);

        const orderedSteps = [];

        for (let i = orderedKeys.length - 1; i >= 0; i--) {
            orderedSteps.push(keyMap[orderedKeys[i].combined()]);
        }

        return orderedSteps;
    }
}
