/**
 * Pipeline step to generate html template.
 */
import { UniteConfiguration } from "../configuration/models/unite/uniteConfiguration";
import { EnginePipelineStepBase } from "../engine/enginePipelineStepBase";
import { EngineVariables } from "../engine/engineVariables";
import { IDisplay } from "../interfaces/IDisplay";
import { IFileSystem } from "../interfaces/IFileSystem";
import { ILogger } from "../interfaces/ILogger";

export class HtmlTemplate extends EnginePipelineStepBase {
    public async process(logger: ILogger, display: IDisplay, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): Promise<number> {
        try {
            super.log(logger, display, "Generating index.html.template in", { rootFolder: engineVariables.rootFolder });

            await this.copyFile(logger, display, fileSystem, engineVariables.assetsDirectory, "index.html.template", engineVariables.rootFolder, "index.html.template");
            return 0;
        } catch (err) {
            super.error(logger, display, "Generating index.html.template", err, { rootFolder: engineVariables.rootFolder });
            return 1;
        }
    }
}