/**
 * Pipeline step to generate eslint configuration.
 */
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { EsLintConfiguration } from "../../configuration/models/eslint/esLintConfiguration";
import { EsLintParserOptions } from "../../configuration/models/eslint/esLintParserOptions";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class EsLint extends PipelineStepBase {
    private static readonly FILENAME: string = ".eslintrc.json";
    private static readonly FILENAME2: string = ".eslintignore";

    private _configuration: EsLintConfiguration;
    private _ignore: string[];

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return super.condition(uniteConfiguration.linter, "ESLint");
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables,
                            mainCondition: boolean): Promise<number> {
        if (mainCondition) {
            if (!super.condition(uniteConfiguration.sourceLanguage, "JavaScript")) {
                logger.error("You can only use ESLint when the source language is JavaScript");
                return 1;
            }

            return super.fileReadJson<EsLintConfiguration>(logger,
                                                           fileSystem,
                                                           engineVariables.wwwRootFolder,
                                                           EsLint.FILENAME,
                                                           engineVariables.force,
                                                           async (obj) => {
                    this._configuration = obj;
                    return super.fileReadLines(logger,
                                               fileSystem,
                                               engineVariables.wwwRootFolder,
                                               EsLint.FILENAME2,
                                               engineVariables.force,
                                               async (lines) => {
                            this._ignore = lines;
                            this.configDefaults(engineVariables);
                            return 0;
                        });

                });
        } else {
            return 0;
        }
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        engineVariables.toggleDevDependency(["eslint"], mainCondition);

        return 0;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        let ret = await super.fileToggleJson(logger,
                                             fileSystem,
                                             engineVariables.wwwRootFolder,
                                             EsLint.FILENAME, engineVariables.force,
                                             mainCondition,
                                             async () => this._configuration);

        if (ret === 0) {
            ret = await super.fileToggleLines(logger,
                                              fileSystem,
                                              engineVariables.wwwRootFolder,
                                              EsLint.FILENAME2,
                                              engineVariables.force,
                                              mainCondition,
                                              async () => {
                    this._ignore.push(super.wrapGeneratedMarker("# ", ""));
                    return this._ignore;
                });
        }

        return ret;
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new EsLintConfiguration();

        defaultConfiguration.parser = "espree";
        defaultConfiguration.parserOptions = new EsLintParserOptions();
        defaultConfiguration.parserOptions.ecmaVersion = 6;
        defaultConfiguration.parserOptions.sourceType = "module";
        defaultConfiguration.parserOptions.ecmaFeatures = {
            legacyDecorators: true
        };

        defaultConfiguration.extends = ["eslint:recommended"];
        defaultConfiguration.env = {
            browser: true
        };
        defaultConfiguration.globals = {
            require: true
        };
        defaultConfiguration.rules = {};
        defaultConfiguration.plugins = [];
        defaultConfiguration.settings = {};

        const defaultIgnore = [
            "dist/*",
            "build/*",
            "test/unit/unit-bootstrap.js",
            "test/unit/unit-module-config.js"
        ];

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);
        this._ignore = ObjectHelper.merge(defaultIgnore, this._ignore);

        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }
        for (let i = this._ignore.length - 1; i >= 0; i--) {
            if (this._ignore[i].trim().length === 0) {
                this._ignore.splice(i, 1);
            }
        }

        engineVariables.setConfiguration("ESLint", this._configuration);
        engineVariables.setConfiguration("ESLint.Ignore", this._ignore);
    }
}
