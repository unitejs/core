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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Less extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Less")) {
                engineVariables.styleLanguageExt = "less";
                engineVariables.www.cssSrcFolder = fileSystem.pathCombine(engineVariables.wwwRootFolder, "less");
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["less"], _super("condition").call(this, uniteConfiguration.cssPre, "Less"));
            if (_super("condition").call(this, uniteConfiguration.cssPre, "Less")) {
                try {
                    logger.info("Creating Less folder", { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssSrcFolder);
                    logger.info("Creating cssDist folder", { cssSrcFolder: engineVariables.www.cssDistFolder });
                    yield fileSystem.directoryCreate(engineVariables.www.cssDistFolder);
                    return 0;
                }
                catch (err) {
                    logger.error("Generating Less folder failed", err, { cssSrcFolder: engineVariables.www.cssSrcFolder });
                    return 1;
                }
            }
            return 0;
        });
    }
}
exports.Less = Less;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2Nzc1ByZS9sZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsVUFBa0IsU0FBUSwrQ0FBc0I7SUFDL0IsVUFBVSxDQUFDLE1BQWUsRUFDZixVQUF1QixFQUN2QixrQkFBc0MsRUFDdEMsZUFBZ0M7OztZQUNwRCxFQUFFLENBQUMsQ0FBQyxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELGVBQWUsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7Z0JBQzFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRyxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBRWxHLEVBQUUsQ0FBQyxDQUFDLG1CQUFlLFlBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUV4RixNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFbkUsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBRTVGLE1BQU0sVUFBVSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVwRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7b0JBQ3ZHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsQ0Qsb0JBa0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY3NzUHJlL2xlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgdG8gZ2VuZXJhdGUgaGFuZGxlIGxlc3Mgc3R5bGluZy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgTGVzcyBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZSwgXCJMZXNzXCIpKSB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc3R5bGVMYW5ndWFnZUV4dCA9IFwibGVzc1wiO1xuICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBcImxlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wibGVzc1wiXSwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUsIFwiTGVzc1wiKSk7XG5cbiAgICAgICAgaWYgKHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLCBcIkxlc3NcIikpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJDcmVhdGluZyBMZXNzIGZvbGRlclwiLCB7IGNzc1NyY0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlcik7XG5cbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkNyZWF0aW5nIGNzc0Rpc3QgZm9sZGVyXCIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc0Rpc3RGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmRpcmVjdG9yeUNyZWF0ZShlbmdpbmVWYXJpYWJsZXMud3d3LmNzc0Rpc3RGb2xkZXIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJHZW5lcmF0aW5nIExlc3MgZm9sZGVyIGZhaWxlZFwiLCBlcnIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==