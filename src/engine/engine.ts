/**
 * Main engine
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { UniteLanguage } from "../configuration/models/unite/uniteLanguage";
import { EnumEx } from "../core/enumEx";
import { IDisplay } from "../interfaces/IDisplay";
import { IEngine } from "../interfaces/IEngine";
import { IEnginePipelineStep } from "../interfaces/IEnginePipelineStep";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";
import { CreateOutputDirectory } from "../pipelineSteps/createOutputDirectory";
import { GenerateGulpBuildConfiguration } from "../pipelineSteps/generateGulpBuildConfiguration";
import { GenerateGulpScaffold } from "../pipelineSteps/generateGulpScaffold";
import { GenerateGulpTasksBuild } from "../pipelineSteps/generateGulpTasksBuild";
import { GenerateGulpTasksUtil } from "../pipelineSteps/generateGulpTasksUtil";
import { GenerateHtmlTemplate } from "../pipelineSteps/generateHtmlTemplate";
import { GeneratePackageJson } from "../pipelineSteps/generatePackageJson";
import { GenerateUniteConfiguration } from "../pipelineSteps/generateUniteConfiguration";
import { EngineValidation } from "./engineValidation";
import { EngineVariables } from "./engineVariables";

export class Engine implements IEngine {
    private _logger: ILogger;
    private _display: IDisplay;
    private _fileSystem: IFileSystem;

    constructor(logger: ILogger, display: IDisplay, fileSystem: IFileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }

    public async init(packageName: string | undefined | null, language: string | undefined | null, outputDirectory: string | undefined | null): Promise<number> {
        if (!EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
            return 1;
        }
        if (!EngineValidation.checkOneOf(this._display, "language", language, EnumEx.getNames(UniteLanguage))) {
            return 1;
        }
        outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory!);
        if (!EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
            return 1;
        }

        this._logger.info("Engine::init", { packageName, language, outputDirectory });

        const uniteConfiguration = new UniteConfiguration();
        uniteConfiguration.name = packageName!;
        uniteConfiguration.language = language!;
        uniteConfiguration.outputDirectory = outputDirectory;
        uniteConfiguration.devDependencies = {};

        const engineVariables: EngineVariables = new EngineVariables();

        const pipelineSteps: IEnginePipelineStep[] = [];
        pipelineSteps.push(new CreateOutputDirectory());
        pipelineSteps.push(new GenerateHtmlTemplate());
        pipelineSteps.push(new GenerateGulpScaffold());
        pipelineSteps.push(new GenerateGulpBuildConfiguration());
        pipelineSteps.push(new GenerateGulpTasksBuild());
        pipelineSteps.push(new GenerateGulpTasksUtil());
        pipelineSteps.push(new GenerateUniteConfiguration());
        pipelineSteps.push(new GeneratePackageJson());

        for (const pipelineStep of pipelineSteps) {
            const ret = await pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration, engineVariables);
            if (ret !== 0) {
                return ret;
            }
        }

        return 0;
    }
}