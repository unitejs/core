"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pipelineKey_1 = require("./pipelineKey");
class Pipeline {
    constructor(logger, fileSystem, pipelineStepFolder) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._pipelineStepFolder = pipelineStepFolder;
        this._steps = [];
        this._moduleIdMap = {};
        this._loadedStepCache = {};
    }
    add(category, key) {
        this._steps.push(new pipelineKey_1.PipelineKey(category, key));
    }
    run(uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyMap = {};
            for (const pipelineStep of this._steps) {
                const exists = yield this.tryLoad(uniteConfiguration, pipelineStep, undefined, false);
                if (exists) {
                    keyMap[pipelineStep.combined()] = this.getStep(pipelineStep);
                }
                else {
                    return 1;
                }
            }
            const pipeline = this.orderByInfluence(keyMap);
            for (const pipelineStep of pipeline) {
                const ret = yield pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            for (const pipelineStep of pipeline) {
                const ret = yield pipelineStep.process(this._logger, this._fileSystem, uniteConfiguration, engineVariables);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    getStep(pipelineKey) {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0 &&
            pipelineKey.key !== undefined && pipelineKey.key !== null && pipelineKey.key.length > 0) {
            const combinedKey = pipelineKey.combined();
            if (this._loadedStepCache[combinedKey] === undefined) {
                const mappedName = this._moduleIdMap[combinedKey];
                if (mappedName !== undefined && this._loadedStepCache[mappedName] !== undefined) {
                    return this._loadedStepCache[mappedName];
                }
            }
            else {
                return this._loadedStepCache[combinedKey];
            }
        }
        return undefined;
    }
    tryLoad(uniteConfiguration, pipelineKey, configurationType, defineProperty = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pipelineKey !== undefined && pipelineKey !== null &&
                pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0) {
                const moduleTypeId = pipelineKey.combined();
                let className = this._moduleIdMap[moduleTypeId];
                if (className === undefined) {
                    const moduleTypeFolder = this._fileSystem.pathCombine(this._pipelineStepFolder, pipelineKey.category);
                    const actualType = configurationType ? configurationType : pipelineKey.category;
                    try {
                        let files = yield this._fileSystem.directoryGetFiles(moduleTypeFolder);
                        files = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
                        if (pipelineKey.key === undefined || pipelineKey.key === null || pipelineKey.key.length === 0) {
                            this._logger.error(`${actualType} should not be blank, possible options could be [${files.join(", ")}]`);
                            return false;
                        }
                        else {
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
                                    const moduleClassName = new pipelineKey_1.PipelineKey(pipelineKey.category, className).combined();
                                    this._loadedStepCache[moduleClassName] = new instance.constructor();
                                    this._moduleIdMap[moduleTypeId] = moduleClassName;
                                    return true;
                                }
                            }
                            this._logger.error(`Pipeline Step ${pipelineKey.key} for arg ${actualType} could not be located, possible options could be [${files.join(", ")}]`);
                            return false;
                        }
                    }
                    catch (err) {
                        this._logger.error(`Pipeline Step ${pipelineKey.key} for arg ${actualType} failed to load`, err);
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else {
                this._logger.error(`Pipeline Step has an invalid key`, undefined, pipelineKey);
                return false;
            }
        });
    }
    orderByInfluence(keyMap) {
        const orderedKeys = [];
        Object.keys(keyMap).sort().forEach(keyString => {
            const keyParts = keyString.split("/");
            const key = new pipelineKey_1.PipelineKey(keyParts[0], keyParts[1]);
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
                        }
                        else {
                            influenceIndex = -1;
                        }
                    }
                    else {
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
exports.Pipeline = Pipeline;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLCtDQUE0QztBQUU1QztJQVNJLFlBQVksTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQTBCO1FBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxHQUFXO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRVksR0FBRyxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNyRixNQUFNLE1BQU0sR0FBb0MsRUFBRSxDQUFDO1lBRW5ELEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFdEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDakUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsTUFBTSxRQUFRLEdBQW9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoRSxHQUFHLENBQUMsQ0FBQyxNQUFNLFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUMvRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7WUFDTCxDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFDNUcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFTSxPQUFPLENBQTBCLFdBQXdCO1FBQzVELEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxTQUFTLElBQUksV0FBVyxLQUFLLElBQUk7WUFDakQsV0FBVyxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN0RyxXQUFXLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDbEQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDOUUsTUFBTSxDQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDaEQsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRVksT0FBTyxDQUFDLGtCQUFzQyxFQUFFLFdBQXdCLEVBQUUsaUJBQTBCLEVBQUUsaUJBQTBCLElBQUk7O1lBQzdJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsS0FBSyxTQUFTLElBQUksV0FBVyxLQUFLLElBQUk7Z0JBQ2pELFdBQVcsQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpHLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFaEQsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdEcsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztvQkFFaEYsSUFBSSxDQUFDO3dCQUNELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUN2RSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFeEYsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksV0FBVyxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDNUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLG9EQUFvRCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDekcsTUFBTSxDQUFDLEtBQUssQ0FBQzt3QkFDakIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDOzRCQUNwRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQ0FDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0NBQzNDLG9DQUFvQztvQ0FDcEMscUNBQXFDO29DQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDMUUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29DQUNqQyxtQ0FBbUM7b0NBQ25DLG9DQUFvQztvQ0FFcEMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBRW5DLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29DQUU1RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dDQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO3dDQUM3QyxNQUFNLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO29DQUNoRixDQUFDO29DQUVELE1BQU0sZUFBZSxHQUFHLElBQUkseUJBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO29DQUNwRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7b0NBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsZUFBZSxDQUFDO29DQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDO2dDQUNoQixDQUFDOzRCQUNMLENBQUM7NEJBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLFdBQVcsQ0FBQyxHQUFHLFlBQVksVUFBVSxxREFBcUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ25KLE1BQU0sQ0FBQyxLQUFLLENBQUM7d0JBQ2pCLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixXQUFXLENBQUMsR0FBRyxZQUFZLFVBQVUsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2pHLE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sZ0JBQWdCLENBQUMsTUFBdUM7UUFDM0QsTUFBTSxXQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUV0QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ3hDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUM7UUFDWixHQUFHLENBQUM7WUFDQSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUU3QyxJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUU1QixVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVM7b0JBQ3hCLElBQUksY0FBYyxDQUFDO29CQUVuQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM1RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNyRCxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUNyRixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQztvQkFDTCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLGNBQWMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BGLENBQUM7b0JBRUQsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDdEUsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixJQUFJLGtCQUFrQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUN0RCxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsUUFBUSxPQUFPLEVBQUU7UUFFbEIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBRXhCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMvQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQXpMRCw0QkF5TEMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGFzcyBmb3IgcGlwZWxpbmVcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuL3BpcGVsaW5lS2V5XCI7XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX3BpcGVsaW5lU3RlcEZvbGRlcjogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfc3RlcHM6IFBpcGVsaW5lS2V5W107XG4gICAgcHJpdmF0ZSBfbW9kdWxlSWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBwcml2YXRlIF9sb2FkZWRTdGVwQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBJUGlwZWxpbmVTdGVwIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwaXBlbGluZVN0ZXBGb2xkZXI6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9waXBlbGluZVN0ZXBGb2xkZXIgPSBwaXBlbGluZVN0ZXBGb2xkZXI7XG4gICAgICAgIHRoaXMuX3N0ZXBzID0gW107XG4gICAgICAgIHRoaXMuX21vZHVsZUlkTWFwID0ge307XG4gICAgICAgIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZSA9IHt9O1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGQoY2F0ZWdvcnk6IHN0cmluZywga2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3RlcHMucHVzaChuZXcgUGlwZWxpbmVLZXkoY2F0ZWdvcnksIGtleSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBydW4odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3Qga2V5TWFwOiB7IFtpZDogc3RyaW5nXTogSVBpcGVsaW5lU3RlcCB9ID0ge307XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgdGhpcy5fc3RlcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIHBpcGVsaW5lU3RlcCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBrZXlNYXBbcGlwZWxpbmVTdGVwLmNvbWJpbmVkKCldID0gdGhpcy5nZXRTdGVwKHBpcGVsaW5lU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmU6IElQaXBlbGluZVN0ZXBbXSA9IHRoaXMub3JkZXJCeUluZmx1ZW5jZShrZXlNYXApO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuaW5pdGlhbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5wcm9jZXNzKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3RlcDxUIGV4dGVuZHMgSVBpcGVsaW5lU3RlcD4ocGlwZWxpbmVLZXk6IFBpcGVsaW5lS2V5KTogVCB7XG4gICAgICAgIGlmIChwaXBlbGluZUtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmtleSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5rZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY29tYmluZWRLZXkgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBlZE5hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFtjb21iaW5lZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKG1hcHBlZE5hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbWFwcGVkTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fbG9hZGVkU3RlcENhY2hlW21hcHBlZE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyB0cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZUtleTogUGlwZWxpbmVLZXksIGNvbmZpZ3VyYXRpb25UeXBlPzogc3RyaW5nLCBkZWZpbmVQcm9wZXJ0eTogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKHBpcGVsaW5lS2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICBjb25zdCBtb2R1bGVUeXBlSWQgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF07XG5cbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZVR5cGVGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX3BpcGVsaW5lU3RlcEZvbGRlciwgcGlwZWxpbmVLZXkuY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbFR5cGUgPSBjb25maWd1cmF0aW9uVHlwZSA/IGNvbmZpZ3VyYXRpb25UeXBlIDogcGlwZWxpbmVLZXkuY2F0ZWdvcnk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZXMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmRpcmVjdG9yeUdldEZpbGVzKG1vZHVsZVR5cGVGb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuZW5kc1dpdGgoXCIuanNcIikpLm1hcChmaWxlID0+IGZpbGUucmVwbGFjZShcIi5qc1wiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpcGVsaW5lS2V5LmtleSA9PT0gdW5kZWZpbmVkIHx8IHBpcGVsaW5lS2V5LmtleSA9PT0gbnVsbCB8fCBwaXBlbGluZUtleS5rZXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYCR7YWN0dWFsVHlwZX0gc2hvdWxkIG5vdCBiZSBibGFuaywgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtmaWxlcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlSWRMb3dlciA9IHBpcGVsaW5lS2V5LmtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxlc1tpXS50b0xvd2VyQ2FzZSgpID09PSBtb2R1bGVJZExvd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShtb2R1bGVUeXBlRm9sZGVyLCBmaWxlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUobG9hZEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGVbY2xhc3NOYW1lXS5wcm90b3R5cGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oYWN0dWFsVHlwZSwgeyBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodW5pdGVDb25maWd1cmF0aW9uLCBhY3R1YWxUeXBlLCB7IHZhbHVlOiBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVDbGFzc05hbWUgPSBuZXcgUGlwZWxpbmVLZXkocGlwZWxpbmVLZXkuY2F0ZWdvcnksIGNsYXNzTmFtZSkuY29tYmluZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkU3RlcENhY2hlW21vZHVsZUNsYXNzTmFtZV0gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXSA9IG1vZHVsZUNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwICR7cGlwZWxpbmVLZXkua2V5fSBmb3IgYXJnICR7YWN0dWFsVHlwZX0gY291bGQgbm90IGJlIGxvY2F0ZWQsIHBvc3NpYmxlIG9wdGlvbnMgY291bGQgYmUgWyR7ZmlsZXMuam9pbihcIiwgXCIpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBpcGVsaW5lIFN0ZXAgJHtwaXBlbGluZUtleS5rZXl9IGZvciBhcmcgJHthY3R1YWxUeXBlfSBmYWlsZWQgdG8gbG9hZGAsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwIGhhcyBhbiBpbnZhbGlkIGtleWAsIHVuZGVmaW5lZCwgcGlwZWxpbmVLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9yZGVyQnlJbmZsdWVuY2Uoa2V5TWFwOiB7IFtpZDogc3RyaW5nXTogSVBpcGVsaW5lU3RlcCB9KTogSVBpcGVsaW5lU3RlcFtdIHtcbiAgICAgICAgY29uc3Qgb3JkZXJlZEtleXM6IFBpcGVsaW5lS2V5W10gPSBbXTtcblxuICAgICAgICBPYmplY3Qua2V5cyhrZXlNYXApLnNvcnQoKS5mb3JFYWNoKGtleVN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXlQYXJ0cyA9IGtleVN0cmluZy5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBuZXcgUGlwZWxpbmVLZXkoa2V5UGFydHNbMF0sIGtleVBhcnRzWzFdKTtcbiAgICAgICAgICAgIG9yZGVyZWRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGNoYW5nZWQ7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JkZXJlZEtleXMubGVuZ3RoICYmICFjaGFuZ2VkOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlcmVkS2V5ID0gb3JkZXJlZEtleXNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgcGlwZWxpbmVTdGVwID0ga2V5TWFwW29yZGVyZWRLZXkuY29tYmluZWQoKV07XG4gICAgICAgICAgICAgICAgY29uc3QgaW5mbHVlbmNlcyA9IHBpcGVsaW5lU3RlcC5pbmZsdWVuY2VzKCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgbGFzdEluZmx1ZW5jZUluZGV4ID0gLTE7XG5cbiAgICAgICAgICAgICAgICBpbmZsdWVuY2VzLmZvckVhY2goaW5mbHVlbmNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZmx1ZW5jZUluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmZsdWVuY2Uua2V5ID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsQ2F0S2V5cyA9IG9yZGVyZWRLZXlzLmZpbHRlcihtYXRjaEtleSA9PiBtYXRjaEtleS5jYXRlZ29yeSA9PT0gaW5mbHVlbmNlLmNhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxDYXRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0Q2F0S2V5ID0gYWxsQ2F0S2V5c1thbGxDYXRLZXlzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmx1ZW5jZUluZGV4ID0gb3JkZXJlZEtleXMuZmluZEluZGV4KG1hdGNoS2V5ID0+IG1hdGNoS2V5Lm1hdGNoZXMobGFzdENhdEtleSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZsdWVuY2VJbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mbHVlbmNlSW5kZXggPSBvcmRlcmVkS2V5cy5maW5kSW5kZXgobWF0Y2hLZXkgPT4gbWF0Y2hLZXkubWF0Y2hlcyhpbmZsdWVuY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxhc3RJbmZsdWVuY2VJbmRleCA9IE1hdGgubWF4KGxhc3RJbmZsdWVuY2VJbmRleCwgaW5mbHVlbmNlSW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsYXN0SW5mbHVlbmNlSW5kZXggJiYgbGFzdEluZmx1ZW5jZUluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcmVkS2V5cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyZWRLZXlzLnNwbGljZShsYXN0SW5mbHVlbmNlSW5kZXgsIDAsIG9yZGVyZWRLZXkpO1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGNoYW5nZWQpO1xuXG4gICAgICAgIGNvbnN0IG9yZGVyZWRTdGVwcyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBvcmRlcmVkS2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgb3JkZXJlZFN0ZXBzLnB1c2goa2V5TWFwW29yZGVyZWRLZXlzW2ldLmNvbWJpbmVkKCldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcmRlcmVkU3RlcHM7XG4gICAgfVxufVxuIl19