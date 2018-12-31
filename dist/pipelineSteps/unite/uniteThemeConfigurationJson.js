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
 * Pipeline step to generate unite-theme.json.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const uniteThemeConfiguration_1 = require("../../configuration/models/uniteTheme/uniteThemeConfiguration");
const engineVariablesMeta_1 = require("../../engine/engineVariablesMeta");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class UniteThemeConfigurationJson extends pipelineStepBase_1.PipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileReadJson: { get: () => super.fileReadJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileReadJson.call(this, logger, fileSystem, fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/"), UniteThemeConfigurationJson.FILENAME, engineVariables.force, (obj) => __awaiter(this, void 0, void 0, function* () {
                this._configuration = obj;
                this.configDefaults(uniteConfiguration, engineVariables);
                return 0;
            }));
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = engineVariables.meta || new engineVariablesMeta_1.EngineVariablesMeta();
            this._configuration.title = meta.title || this._configuration.title || uniteConfiguration.packageName || "";
            this._configuration.shortName = meta.shortName || this._configuration.shortName || this._configuration.title;
            this._configuration.metaDescription = meta.description || this._configuration.metaDescription || this._configuration.title;
            this._configuration.metaKeywords = meta.keywords || this._configuration.metaKeywords || this._configuration.title.split(" ");
            this._configuration.metaAuthor = meta.author || this._configuration.metaAuthor;
            this._configuration.metaAuthorEmail = meta.authorEmail || this._configuration.metaAuthorEmail;
            this._configuration.metaAuthorWebSite = meta.authorWebSite || this._configuration.metaAuthorWebSite;
            this._configuration.namespace = meta.namespace || this._configuration.namespace;
            this._configuration.organization = meta.organization || this._configuration.organization;
            this._configuration.copyright = meta.copyright || this._configuration.copyright;
            this._configuration.webSite = meta.webSite || this._configuration.webSite;
            meta.title = this._configuration.title;
            meta.shortName = this._configuration.shortName;
            meta.description = this._configuration.metaDescription;
            meta.keywords = this._configuration.metaKeywords;
            meta.author = this._configuration.metaAuthor;
            meta.authorEmail = this._configuration.metaAuthorEmail;
            meta.authorWebSite = this._configuration.metaAuthorWebSite;
            meta.namespace = this._configuration.namespace;
            meta.organization = this._configuration.organization;
            meta.copyright = this._configuration.copyright;
            meta.webSite = this._configuration.webSite;
            engineVariables.meta = meta;
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            fileToggleJson: { get: () => super.fileToggleJson }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.fileToggleJson.call(this, logger, fileSystem, fileSystem.pathCombine(engineVariables.www.assetsSrc, "theme/"), UniteThemeConfigurationJson.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () { return this._configuration; }));
        });
    }
    configDefaults(uniteConfiguration, engineVariables) {
        const defaultConfiguration = new uniteThemeConfiguration_1.UniteThemeConfiguration();
        defaultConfiguration.themeHeaders = [];
        defaultConfiguration.customHeaders = [];
        defaultConfiguration.backgroundColor = "#339933";
        defaultConfiguration.themeColor = "#339933";
        this._configuration = objectHelper_1.ObjectHelper.merge(defaultConfiguration, this._configuration);
        engineVariables.setConfiguration("UniteTheme", this._configuration);
    }
}
UniteThemeConfigurationJson.FILENAME = "unite-theme.json";
exports.UniteThemeConfigurationJson = UniteThemeConfigurationJson;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3VuaXRlL3VuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw4RUFBMkU7QUFJM0UsMkdBQXdHO0FBRXhHLDBFQUF1RTtBQUN2RSxvRUFBaUU7QUFFakUsTUFBYSwyQkFBNEIsU0FBUSxtQ0FBZ0I7SUFLaEQsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzlKLE9BQU8sT0FBTSxZQUFZLFlBQTBCLE1BQU0sRUFDTixVQUFVLEVBQ1YsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFDL0QsMkJBQTJCLENBQUMsUUFBUSxFQUNwQyxlQUFlLENBQUMsS0FBSyxFQUNyQixDQUFPLEdBQUcsRUFBRSxFQUFFO2dCQUM3RCxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztnQkFFMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFekQsT0FBTyxDQUFDLENBQUM7WUFDYixDQUFDLENBQUEsRUFBRTtRQUNQLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixNQUFNLElBQUksR0FBd0IsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLHlDQUFtQixFQUFFLENBQUM7WUFFcEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1lBQzVHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxHQUFHLElBQUksQ0FB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RUFDL0QsMkJBQTJCLENBQUMsUUFBUSxFQUNwQyxlQUFlLENBQUMsS0FBSyxFQUNyQixhQUFhLEVBQ2IsR0FBUSxFQUFFLGdEQUFDLE9BQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQSxHQUFBLEVBQUU7UUFDaEUsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQzNGLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO1FBRTNELG9CQUFvQixDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkMsb0JBQW9CLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QyxvQkFBb0IsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2pELG9CQUFvQixDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFFNUMsSUFBSSxDQUFDLGNBQWMsR0FBRywyQkFBWSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFcEYsZUFBZSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7QUF4RXVCLG9DQUFRLEdBQVcsa0JBQWtCLENBQUM7QUFEbEUsa0VBMEVDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvdW5pdGUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25Kc29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHVuaXRlLXRoZW1lLmpzb24uXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlVGhlbWVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlVGhlbWUvdW5pdGVUaGVtZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXNNZXRhIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNNZXRhXCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24gZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRTogc3RyaW5nID0gXCJ1bml0ZS10aGVtZS5qc29uXCI7XG5cbiAgICBwcml2YXRlIF9jb25maWd1cmF0aW9uOiBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbjtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlUmVhZEpzb248VW5pdGVUaGVtZUNvbmZpZ3VyYXRpb24+KGxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyYywgXCJ0aGVtZS9cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXRlVGhlbWVDb25maWd1cmF0aW9uSnNvbi5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAob2JqKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gb2JqO1xuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgbWV0YTogRW5naW5lVmFyaWFibGVzTWV0YSA9IGVuZ2luZVZhcmlhYmxlcy5tZXRhIHx8IG5ldyBFbmdpbmVWYXJpYWJsZXNNZXRhKCk7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi50aXRsZSA9IG1ldGEudGl0bGUgfHwgdGhpcy5fY29uZmlndXJhdGlvbi50aXRsZSB8fCB1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU5hbWUgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5zaG9ydE5hbWUgPSBtZXRhLnNob3J0TmFtZSB8fCB0aGlzLl9jb25maWd1cmF0aW9uLnNob3J0TmFtZSB8fCB0aGlzLl9jb25maWd1cmF0aW9uLnRpdGxlO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFEZXNjcmlwdGlvbiA9IG1ldGEuZGVzY3JpcHRpb24gfHwgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhRGVzY3JpcHRpb24gfHwgdGhpcy5fY29uZmlndXJhdGlvbi50aXRsZTtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhS2V5d29yZHMgPSBtZXRhLmtleXdvcmRzIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUtleXdvcmRzIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24udGl0bGUuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3IgPSBtZXRhLmF1dGhvciB8fCB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3I7XG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvckVtYWlsID0gbWV0YS5hdXRob3JFbWFpbCB8fCB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3JFbWFpbDtcbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhQXV0aG9yV2ViU2l0ZSA9IG1ldGEuYXV0aG9yV2ViU2l0ZSB8fCB0aGlzLl9jb25maWd1cmF0aW9uLm1ldGFBdXRob3JXZWJTaXRlO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm5hbWVzcGFjZSA9IG1ldGEubmFtZXNwYWNlIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ubmFtZXNwYWNlO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLm9yZ2FuaXphdGlvbiA9IG1ldGEub3JnYW5pemF0aW9uIHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24ub3JnYW5pemF0aW9uO1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLmNvcHlyaWdodCA9IG1ldGEuY29weXJpZ2h0IHx8IHRoaXMuX2NvbmZpZ3VyYXRpb24uY29weXJpZ2h0O1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uLndlYlNpdGUgPSBtZXRhLndlYlNpdGUgfHwgdGhpcy5fY29uZmlndXJhdGlvbi53ZWJTaXRlO1xuXG4gICAgICAgIG1ldGEudGl0bGUgPSB0aGlzLl9jb25maWd1cmF0aW9uLnRpdGxlO1xuICAgICAgICBtZXRhLnNob3J0TmFtZSA9IHRoaXMuX2NvbmZpZ3VyYXRpb24uc2hvcnROYW1lO1xuICAgICAgICBtZXRhLmRlc2NyaXB0aW9uID0gdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhRGVzY3JpcHRpb247XG4gICAgICAgIG1ldGEua2V5d29yZHMgPSAgdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhS2V5d29yZHM7XG4gICAgICAgIG1ldGEuYXV0aG9yID0gdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhQXV0aG9yO1xuICAgICAgICBtZXRhLmF1dGhvckVtYWlsID0gdGhpcy5fY29uZmlndXJhdGlvbi5tZXRhQXV0aG9yRW1haWw7XG4gICAgICAgIG1ldGEuYXV0aG9yV2ViU2l0ZSA9IHRoaXMuX2NvbmZpZ3VyYXRpb24ubWV0YUF1dGhvcldlYlNpdGU7XG4gICAgICAgIG1ldGEubmFtZXNwYWNlID0gdGhpcy5fY29uZmlndXJhdGlvbi5uYW1lc3BhY2U7XG4gICAgICAgIG1ldGEub3JnYW5pemF0aW9uID0gdGhpcy5fY29uZmlndXJhdGlvbi5vcmdhbml6YXRpb247XG4gICAgICAgIG1ldGEuY29weXJpZ2h0ID0gdGhpcy5fY29uZmlndXJhdGlvbi5jb3B5cmlnaHQ7XG4gICAgICAgIG1ldGEud2ViU2l0ZSA9IHRoaXMuX2NvbmZpZ3VyYXRpb24ud2ViU2l0ZTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMubWV0YSA9IG1ldGE7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlSnNvbihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMud3d3LmFzc2V0c1NyYywgXCJ0aGVtZS9cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbkpzb24uRklMRU5BTUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMoKSA9PiB0aGlzLl9jb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlndXJhdGlvbiA9IG5ldyBVbml0ZVRoZW1lQ29uZmlndXJhdGlvbigpO1xuXG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLnRoZW1lSGVhZGVycyA9IFtdO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi5jdXN0b21IZWFkZXJzID0gW107XG4gICAgICAgIGRlZmF1bHRDb25maWd1cmF0aW9uLmJhY2tncm91bmRDb2xvciA9IFwiIzMzOTkzM1wiO1xuICAgICAgICBkZWZhdWx0Q29uZmlndXJhdGlvbi50aGVtZUNvbG9yID0gXCIjMzM5OTMzXCI7XG5cbiAgICAgICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IE9iamVjdEhlbHBlci5tZXJnZShkZWZhdWx0Q29uZmlndXJhdGlvbiwgdGhpcy5fY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnNldENvbmZpZ3VyYXRpb24oXCJVbml0ZVRoZW1lXCIsIHRoaXMuX2NvbmZpZ3VyYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==
