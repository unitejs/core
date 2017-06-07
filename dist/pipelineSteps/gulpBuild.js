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
/**
 * Pipeline step to generate gulp tasks for build.
 */
const buildConfiguration_1 = require("../configuration/models/build/buildConfiguration");
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class GulpBuild extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Generating gulp build.config.json in", { gulpBuildFolder: engineVariables.gulpBuildFolder });
                const buildConfiguration = new buildConfiguration_1.BuildConfiguration();
                buildConfiguration.srcFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.sourceFolder);
                buildConfiguration.distFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.distFolder);
                buildConfiguration.unitTestFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestFolder);
                buildConfiguration.unitTestSrcFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestSrcFolder);
                buildConfiguration.unitTestDistFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.unitTestDistFolder);
                buildConfiguration.e2eTestSrcFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestSrcFolder);
                buildConfiguration.e2eTestDistFolder = fileSystem.pathDirectoryRelative(uniteConfiguration.outputDirectory, engineVariables.e2eTestDistFolder);
                buildConfiguration.sourceMaps = uniteConfiguration.sourceMaps;
                yield fileSystem.fileWriteJson(engineVariables.gulpBuildFolder, "build.config.json", buildConfiguration);
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating gulp build.config.json failed", err, { gulpBuildFolder: engineVariables.gulpBuildFolder });
                return 1;
            }
        });
    }
}
exports.GulpBuild = GulpBuild;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvZ3VscEJ1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHlGQUFzRjtBQUV0Riw2RUFBMEU7QUFNMUUsZUFBdUIsU0FBUSwrQ0FBc0I7SUFDcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUV6SCxNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztnQkFFcEQsa0JBQWtCLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNsSSxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2pJLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDekksa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDL0ksa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDakosa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDN0ksa0JBQWtCLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDL0ksa0JBQWtCLENBQUMsVUFBVSxHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztnQkFFOUQsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFFekcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLDBDQUEwQyxFQUFFLEdBQUcsRUFBRSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ3BJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF4QkQsOEJBd0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvZ3VscEJ1aWxkLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
