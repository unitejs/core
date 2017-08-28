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
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.e2eTestRunner !== "None") {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7O1lBQzdDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUNsQyxnQkFBZ0Isa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFFBQVEsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5SyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUU1RixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztnQkFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFDbEIsY0FBYyxFQUNkLElBQUksRUFDSixlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFDN0IsSUFBSSxFQUNK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LENBQUM7S0FBQTtDQUNKO0FBNUtELGdEQTRLQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBzY2FmZm9sZGluZyBmb3Igc2hhcmVkIGFwcGxpY2F0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFyZWRBcHBGcmFtZXdvcmsgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBTb3VyY2UobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjLyR7dW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLnRvTG93ZXJDYXNlKCl9YCk7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIEFwcCBTb3VyY2UgaW5cIiwgeyBhcHBTb3VyY2VGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlLmluZGV4T2YoXCIhXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICBmaWxlID0gZmlsZS5yZXBsYWNlKFwiIVwiLCBcIi5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbGUgKz0gYC4ke2VuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWZmb2xkRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBIdG1sKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxGaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjL2h0bWwvYCk7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIEFwcCBIVE1MIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGh0bWxGaWxlIG9mIGh0bWxGaWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWZmb2xkRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtodG1sRmlsZX0uaHRtbGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtodG1sRmlsZX0uaHRtbGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUFwcENzcyhsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzc0ZpbGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNjYWZmb2xkRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke3VuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9zcmMvY3NzLyR7dW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZS50b0xvd2VyQ2FzZSgpfS9gKTtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIEFwcCBDU1MgaW5cIiwgeyBhcHBTb3VyY2VGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgY3NzRmlsZSBvZiBjc3NGaWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWZmb2xkRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtjc3NGaWxlfS4ke2VuZ2luZVZhcmlhYmxlcy5zdHlsZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtjc3NGaWxlfS4ke2VuZ2luZVZhcmlhYmxlcy5zdHlsZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG5cbiAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGdlbmVyYXRlVW5pdFRlc3QobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NoYXJlZDogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIgIT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgdW5pdCB0ZXN0IHNjYWZmb2xkIHNoYXJlZFwiLCB7IHVuaXRUZXN0U3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0U3JjRm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBhcHBGcmFtZXdvcmsgPSBpc1NoYXJlZCA/IFwic2hhcmVkXCIgOiB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29uc3QgdW5pdFRlc3RzU2NhZmZvbGQgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke2FwcEZyYW1ld29ya30vdGVzdC91bml0L3NyYy9zb3VyY2VMYW5ndWFnZS8ke3VuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZS50b0xvd2VyQ2FzZSgpfS9gICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHt1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RGcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vYCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVuaXRUZXN0c1NjYWZmb2xkTW9kdWxlVHlwZSA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay9zaGFyZWQvdGVzdC91bml0L21vZHVsZVR5cGUvJHt1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZS50b0xvd2VyQ2FzZSgpfS9gKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBzcGVjIG9mIHNwZWNzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRUZXN0c1NjYWZmb2xkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7c3BlY30uc3BlYy4ke2VuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdFNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9LnNwZWMuJHtlbmdpbmVWYXJpYWJsZXMuc291cmNlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0VGVzdHNTY2FmZm9sZE1vZHVsZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuaXQtYm9vdHN0cmFwLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LnVuaXRUZXN0Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0LWJvb3RzdHJhcC5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVFMmVUZXN0KGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciAhPT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBlMmUgdGVzdCBzY2FmZm9sZCBzaGFyZWRcIiwgeyB1bml0VGVzdFNyY0ZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0U3JjRm9sZGVyIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBlMmVUZXN0c1NjYWZmb2xkID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke3VuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS90ZXN0L2UyZS9zcmMvZTJlVGVzdFJ1bm5lci9gICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3VuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0UnVubmVyLnRvTG93ZXJDYXNlKCl9L3NvdXJjZUxhbmd1YWdlL2AgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7dW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLnRvTG93ZXJDYXNlKCl9LyR7dW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RGcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vYCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qgc3BlYyBvZiBzcGVjcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlMmVUZXN0c1NjYWZmb2xkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7c3BlY30uc3BlYy4ke2VuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5lMmVUZXN0U3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7c3BlY30uc3BlYy4ke2VuZ2luZVZhcmlhYmxlcy5zb3VyY2VMYW5ndWFnZUV4dH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVDc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIGFwcGxpY2F0aW9uIGNzcyBzY2FmZm9sZCBzaGFyZWRcIiwgeyBjc3NTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzU3JjRm9sZGVyIH0pO1xuXG4gICAgICAgIGNvbnN0IGFzc2V0Q3NzRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLCBgYXBwRnJhbWV3b3JrL3NoYXJlZC9jc3MvJHt1bml0ZUNvbmZpZ3VyYXRpb24uY3NzUHJlLnRvTG93ZXJDYXNlKCl9YCk7XG5cbiAgICAgICAgY29uc3Qgc3R5bGVzID0gW1wiYXBwXCIsIFwibWFpblwiLCBcInJlc2V0XCJdO1xuXG4gICAgICAgIGZvciAoY29uc3Qgc3R5bGUgb2Ygc3R5bGVzKSB7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBzdXBlci5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGFzc2V0Q3NzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7c3R5bGV9LiR7ZW5naW5lVmFyaWFibGVzLnN0eWxlTGFuZ3VhZ2VFeHR9YCwgZW5naW5lVmFyaWFibGVzLnd3dy5jc3NTcmNGb2xkZXIsIGAke3N0eWxlfS4ke2VuZ2luZVZhcmlhYmxlcy5zdHlsZUxhbmd1YWdlRXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UpO1xuXG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==
