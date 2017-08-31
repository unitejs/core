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
const enginePipelineStepBase_1 = require("../engine/enginePipelineStepBase");
class SharedAppFramework extends enginePipelineStepBase_1.EnginePipelineStepBase {
    generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);
            logger.info("Generating App Source in", { appSourceFolder: engineVariables.www.srcFolder });
            for (let file of files) {
                if (file.indexOf("!") >= 0) {
                    file = file.replace("!", ".");
                }
                else {
                    file += `.${engineVariables.sourceLanguageExt}`;
                }
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, file, engineVariables.www.srcFolder, file, engineVariables.force);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    generateAppHtml(logger, fileSystem, uniteConfiguration, engineVariables, htmlFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/html/`);
            logger.info("Generating App HTML in", { appSourceFolder: engineVariables.www.srcFolder });
            for (const htmlFile of htmlFiles) {
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${htmlFile}.html`, engineVariables.www.srcFolder, `${htmlFile}.html`, engineVariables.force);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    generateAppCss(logger, fileSystem, uniteConfiguration, engineVariables, cssFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/src/css/${uniteConfiguration.cssPre.toLowerCase()}/`);
            logger.info("Generating App CSS in", { appSourceFolder: engineVariables.www.srcFolder });
            for (const cssFile of cssFiles) {
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${cssFile}.${engineVariables.styleLanguageExt}`, engineVariables.www.srcFolder, `${cssFile}.${engineVariables.styleLanguageExt}`, engineVariables.force);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, specs, isShared) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!_super("condition").call(this, uniteConfiguration.unitTestRunner, "None")) {
                logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();
                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${appFramework}/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                    `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);
                const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);
                for (const spec of specs) {
                    const ret = yield this.copyFile(logger, fileSystem, unitTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.www.unitTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.force);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                return yield this.copyFile(logger, fileSystem, unitTestsScaffoldModuleType, "unit-bootstrap.js", engineVariables.www.unitTestFolder, "unit-bootstrap.js", engineVariables.force);
            }
            else {
                return 0;
            }
        });
    }
    generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, specs) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!_super("condition").call(this, uniteConfiguration.e2eTestRunner, "None")) {
                logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });
                const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${uniteConfiguration.applicationFramework.toLowerCase()}/test/e2e/src/e2eTestRunner/` +
                    `${uniteConfiguration.e2eTestRunner.toLowerCase()}/sourceLanguage/` +
                    `${uniteConfiguration.sourceLanguage.toLowerCase()}/${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);
                for (const spec of specs) {
                    const ret = yield this.copyFile(logger, fileSystem, e2eTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.www.e2eTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.force);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                return 0;
            }
            else {
                return 0;
            }
        });
    }
    generateCss(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Generating application css scaffold shared", { cssSrcFolder: engineVariables.www.cssSrcFolder });
            const assetCssFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/css/${uniteConfiguration.cssPre.toLowerCase()}`);
            const styles = ["app", "main", "reset"];
            for (const style of styles) {
                const ret = yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `${style}.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `${style}.${engineVariables.styleLanguageExt}`, engineVariables.force);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.SharedAppFramework = SharedAppFramework;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsNkVBQTBFO0FBRzFFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7O1lBQzdDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUNsQyxnQkFBZ0Isa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFFBQVEsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5SyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUU1RixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztnQkFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFDbEIsY0FBYyxFQUNkLElBQUksRUFDSixlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFDN0IsSUFBSSxFQUNKLGVBQWUsQ0FBQyxLQUFLLENBQUMs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QUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUE1S0QsZ0RBNEtDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2hhcmVkQXBwRnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBzaGFyZWQgYXBwbGljYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXJlZEFwcEZyYW1ld29yayBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNjYWZmb2xkRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke3VuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9zcmMvJHt1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UudG9Mb3dlckNhc2UoKX1gKTtcblxuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgQXBwIFNvdXJjZSBpblwiLCB7IGFwcFNvdXJjZUZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIiFcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlLnJlcGxhY2UoXCIhXCIsIFwiLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsZSArPSBgLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhZmZvbGRGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUFwcEh0bWwobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbEZpbGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNjYWZmb2xkRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke3VuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9zcmMvaHRtbC9gKTtcblxuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgQXBwIEhUTUwgaW5cIiwgeyBhcHBTb3VyY2VGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgaHRtbEZpbGUgb2YgaHRtbEZpbGVzKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhZmZvbGRGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2h0bWxGaWxlfS5odG1sYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2h0bWxGaWxlfS5odG1sYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGdlbmVyYXRlQXBwQ3NzKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzRmlsZXM6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3Qgc2NhZmZvbGRGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrLyR7dW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCl9L3NyYy9jc3MvJHt1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLnRvTG93ZXJDYXNlKCl9L2ApO1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgQXBwIENTUyBpblwiLCB7IGFwcFNvdXJjZUZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBjc3NGaWxlIG9mIGNzc0ZpbGVzKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhZmZvbGRGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2Nzc0ZpbGV9LiR7ZW5naW5lVmFyaWFibGVzLnN0eWxlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2Nzc0ZpbGV9LiR7ZW5naW5lVmFyaWFibGVzLnN0eWxlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVVbml0VGVzdChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3M6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2hhcmVkOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIk5vbmVcIikpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyB1bml0IHRlc3Qgc2NhZmZvbGQgc2hhcmVkXCIsIHsgdW5pdFRlc3RTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcEZyYW1ld29yayA9IGlzU2hhcmVkID8gXCJzaGFyZWRcIiA6IHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCB1bml0VGVzdHNTY2FmZm9sZCA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrLyR7YXBwRnJhbWV3b3JrfS90ZXN0L3VuaXQvc3JjL3NvdXJjZUxhbmd1YWdlLyR7dW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLnRvTG93ZXJDYXNlKCl9L2AgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3VuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9gKTtcblxuICAgICAgICAgICAgY29uc3QgdW5pdFRlc3RzU2NhZmZvbGRNb2R1bGVUeXBlID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrL3NoYXJlZC90ZXN0L3VuaXQvbW9kdWxlVHlwZS8ke3VuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlLnRvTG93ZXJDYXNlKCl9L2ApO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNwZWMgb2Ygc3BlY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdFRlc3RzU2NhZmZvbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzcGVjfS5zcGVjLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0U3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7c3BlY30uc3BlYy4ke2VuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRUZXN0c1NjYWZmb2xkTW9kdWxlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdC1ib290c3RyYXAuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuaXQtYm9vdHN0cmFwLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUUyZVRlc3QobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3M6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIsIFwiTm9uZVwiKSkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIGUyZSB0ZXN0IHNjYWZmb2xkIHNoYXJlZFwiLCB7IHVuaXRUZXN0U3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmUyZVRlc3RTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGUyZVRlc3RzU2NhZmZvbGQgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrLyR7dW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCl9L3Rlc3QvZTJlL3NyYy9lMmVUZXN0UnVubmVyL2AgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7dW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIudG9Mb3dlckNhc2UoKX0vc291cmNlTGFuZ3VhZ2UvYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHt1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UudG9Mb3dlckNhc2UoKX0vJHt1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdEZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9gKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBzcGVjIG9mIHNwZWNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGUyZVRlc3RzU2NhZmZvbGQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzcGVjfS5zcGVjLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LmUyZVRlc3RTcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzcGVjfS5zcGVjLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUNzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgYXBwbGljYXRpb24gY3NzIHNjYWZmb2xkIHNoYXJlZFwiLCB7IGNzc1NyY0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgY29uc3QgYXNzZXRDc3NGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIGBhcHBGcmFtZXdvcmsvc2hhcmVkL2Nzcy8ke3VuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUudG9Mb3dlckNhc2UoKX1gKTtcblxuICAgICAgICBjb25zdCBzdHlsZXMgPSBbXCJhcHBcIiwgXCJtYWluXCIsIFwicmVzZXRcIl07XG5cbiAgICAgICAgZm9yIChjb25zdCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHN1cGVyLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgYXNzZXRDc3NGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzdHlsZX0uJHtlbmdpbmVWYXJpYWJsZXMuc3R5bGVMYW5ndWFnZUV4dH1gLCBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciwgYCR7c3R5bGV9LiR7ZW5naW5lVmFyaWFibGVzLnN0eWxlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19