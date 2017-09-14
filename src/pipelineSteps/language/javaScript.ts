/**
 * Pipeline step to generate babel configuration.
 */
import { ArrayHelper } from "unitejs-framework/dist/helpers/arrayHelper";
import { ObjectHelper } from "unitejs-framework/dist/helpers/objectHelper";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BabelConfiguration } from "../../configuration/models/babel/babelConfiguration";
import { UniteConfiguration } from "../../configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../engine/engineVariables";
import { PipelineKey } from "../../engine/pipelineKey";
import { PipelineStepBase } from "../../engine/pipelineStepBase";

export class JavaScript extends PipelineStepBase {
    private static FILENAME: string = ".babelrc";

    private _configuration: BabelConfiguration;

    public influences(): PipelineKey[] {
        return [
            new PipelineKey("unite", "uniteConfigurationJson"),
            new PipelineKey("content", "packageJson")
        ];
    }

    public async initialise(logger: ILogger,
                            fileSystem: IFileSystem,
                            uniteConfiguration: UniteConfiguration,
                            engineVariables: EngineVariables): Promise<number> {
        const isJavaScript = super.condition(uniteConfiguration.sourceLanguage, "JavaScript");
        ArrayHelper.addRemove(uniteConfiguration.sourceExtensions, "js", isJavaScript);
        if (isJavaScript) {
            logger.info(`Initialising ${JavaScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

            if (!engineVariables.force) {
                try {
                    const exists = await fileSystem.fileExists(engineVariables.wwwRootFolder, JavaScript.FILENAME);
                    if (exists) {
                        this._configuration = await fileSystem.fileReadJson<BabelConfiguration>(engineVariables.wwwRootFolder, JavaScript.FILENAME);
                    }
                } catch (err) {
                    logger.error(`Reading existing ${JavaScript.FILENAME} failed`, err);
                    return 1;
                }
            }

            this.configDefaults(engineVariables);
        }
        return 0;
    }
    public async process(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], super.condition(uniteConfiguration.sourceLanguage, "JavaScript"));

        if (super.condition(uniteConfiguration.sourceLanguage, "JavaScript")) {
            try {
                logger.info(`Generating ${JavaScript.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });

                await fileSystem.fileWriteJson(engineVariables.wwwRootFolder, JavaScript.FILENAME, this._configuration);

                return 0;
            } catch (err) {
                logger.error(`Generating ${JavaScript.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                return 1;
            }
        } else {
            return await super.deleteFile(logger, fileSystem, engineVariables.wwwRootFolder, JavaScript.FILENAME, engineVariables.force);
        }
    }

    private configDefaults(engineVariables: EngineVariables): void {
        const defaultConfiguration = new BabelConfiguration();

        defaultConfiguration.presets = [];
        defaultConfiguration.plugins = [];
        defaultConfiguration.env = {};

        this._configuration = ObjectHelper.merge(defaultConfiguration, this._configuration);

        engineVariables.setConfiguration("Babel", this._configuration);
    }
}
