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
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, file, engineVariables.www.srcFolder, file);
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
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${htmlFile}.html`, engineVariables.www.srcFolder, `${htmlFile}.html`);
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
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${cssFile}.${engineVariables.styleLanguageExt}`, engineVariables.www.srcFolder, `${cssFile}.${engineVariables.styleLanguageExt}`);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, specs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.unitTestRunner !== "None") {
                logger.info("Generating unit test scaffold shared", { unitTestSrcFolder: engineVariables.www.unitTestSrcFolder });
                const unitTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/test/unit/src/sourceLanguage/${uniteConfiguration.sourceLanguage.toLowerCase()}/` +
                    `${uniteConfiguration.unitTestFramework.toLowerCase()}/`);
                const unitTestsScaffoldModuleType = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/test/unit/moduleType/${uniteConfiguration.moduleType.toLowerCase()}/`);
                for (const spec of specs) {
                    const ret = yield this.copyFile(logger, fileSystem, unitTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.www.unitTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                return yield this.copyFile(logger, fileSystem, unitTestsScaffoldModuleType, "unit-bootstrap.js", engineVariables.www.unitTestFolder, "unit-bootstrap.js");
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
                    const ret = yield this.copyFile(logger, fileSystem, e2eTestsScaffold, `${spec}.spec.${engineVariables.sourceLanguageExt}`, engineVariables.www.e2eTestSrcFolder, `${spec}.spec.${engineVariables.sourceLanguageExt}`);
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
                const ret = yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `${style}.${engineVariables.styleLanguageExt}`, engineVariables.www.cssSrcFolder, `${style}.${engineVariables.styleLanguageExt}`);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.SharedAppFramework = SharedAppFramework;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLHdCQUF5QyxTQUFRLCtDQUFzQjtJQUNuRCxpQkFBaUIsQ0FBQyxNQUFlLEVBQ2YsVUFBdUIsRUFDdkIsa0JBQXNDLEVBQ3RDLGVBQWdDLEVBQ2hDLEtBQWU7O1lBQzdDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUNsQyxnQkFBZ0Isa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLFFBQVEsa0JBQWtCLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5SyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUU1RixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLElBQUksSUFBSSxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDcEQsQ0FBQztnQkFDRCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFDbEIsY0FBYyxFQUNkLElBQUksRUFDSixlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFDN0IsSUFBSSxDQUFD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QUFnQzs7O1lBQzFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLEVBQUUsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBRTlHLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixrQkFBa0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXhKLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV4QyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLEdBQUcsR0FBRyxNQUFNLGtCQUFjLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQ2xDLEdBQUcsS0FBSyxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsS0FBSyxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBRW5LLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2YsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0NBQ0o7QUFsS0QsZ0RBa0tDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvYXBwbGljYXRpb25GcmFtZXdvcmsvc2hhcmVkQXBwRnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBzaGFyZWQgYXBwbGljYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXJlZEFwcEZyYW1ld29yayBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBzdHJpbmdbXSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHNjYWZmb2xkRm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcEZyYW1ld29yay8ke3VuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9zcmMvJHt1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UudG9Mb3dlckNhc2UoKX1gKTtcblxuICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgQXBwIFNvdXJjZSBpblwiLCB7IGFwcFNvdXJjZUZvbGRlcjogZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKGZpbGUuaW5kZXhPZihcIiFcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlLnJlcGxhY2UoXCIhXCIsIFwiLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsZSArPSBgLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhZmZvbGRGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBIdG1sKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxGaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjL2h0bWwvYCk7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIEFwcCBIVE1MIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGh0bWxGaWxlIG9mIGh0bWxGaWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWZmb2xkRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtodG1sRmlsZX0uaHRtbGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuc3JjRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtodG1sRmlsZX0uaHRtbGApO1xuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBDc3MobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NGaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjL2Nzcy8ke3VuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUudG9Mb3dlckNhc2UoKX0vYCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBBcHAgQ1NTIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNzc0ZpbGUgb2YgY3NzRmlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FmZm9sZEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7Y3NzRmlsZX0uJHtlbmdpbmVWYXJpYWJsZXMuc3R5bGVMYW5ndWFnZUV4dH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7Y3NzRmlsZX0uJHtlbmdpbmVWYXJpYWJsZXMuc3R5bGVMYW5ndWFnZUV4dH1gKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVVbml0VGVzdChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3M6IHN0cmluZ1tdKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdFJ1bm5lciAhPT0gXCJOb25lXCIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyB1bml0IHRlc3Qgc2NhZmZvbGQgc2hhcmVkXCIsIHsgdW5pdFRlc3RTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHVuaXRUZXN0c1NjYWZmb2xkID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvc2hhcmVkL3Rlc3QvdW5pdC9zcmMvc291cmNlTGFuZ3VhZ2UvJHt1bml0ZUNvbmZpZ3VyYXRpb24uc291cmNlTGFuZ3VhZ2UudG9Mb3dlckNhc2UoKX0vYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7dW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0RnJhbWV3b3JrLnRvTG93ZXJDYXNlKCl9L2ApO1xuXG4gICAgICAgICAgICBjb25zdCB1bml0VGVzdHNTY2FmZm9sZE1vZHVsZVR5cGUgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvc2hhcmVkL3Rlc3QvdW5pdC9tb2R1bGVUeXBlLyR7dW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUudG9Mb3dlckNhc2UoKX0vYCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qgc3BlYyBvZiBzcGVjcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0VGVzdHNTY2FmZm9sZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9LnNwZWMuJHtlbmdpbmVWYXJpYWJsZXMuc291cmNlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RTcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzcGVjfS5zcGVjLiR7ZW5naW5lVmFyaWFibGVzLnNvdXJjZUxhbmd1YWdlRXh0fWApO1xuICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdFRlc3RzU2NhZmZvbGRNb2R1bGVUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0LWJvb3RzdHJhcC5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy51bml0VGVzdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdC1ib290c3RyYXAuanNcIik7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGdlbmVyYXRlRTJlVGVzdChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmUyZVRlc3RSdW5uZXIgIT09IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgZTJlIHRlc3Qgc2NhZmZvbGQgc2hhcmVkXCIsIHsgdW5pdFRlc3RTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdFNyY0ZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3QgZTJlVGVzdHNTY2FmZm9sZCA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vdGVzdC9lMmUvc3JjL2UyZVRlc3RSdW5uZXIvYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHt1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lci50b0xvd2VyQ2FzZSgpfS9zb3VyY2VMYW5ndWFnZS9gICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3VuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZS50b0xvd2VyQ2FzZSgpfS8ke3VuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrLnRvTG93ZXJDYXNlKCl9L2ApO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNwZWMgb2Ygc3BlY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZTJlVGVzdHNTY2FmZm9sZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9LnNwZWMuJHtlbmdpbmVWYXJpYWJsZXMuc291cmNlTGFuZ3VhZ2VFeHR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdFNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9LnNwZWMuJHtlbmdpbmVWYXJpYWJsZXMuc291cmNlTGFuZ3VhZ2VFeHR9YCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGdlbmVyYXRlQ3NzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBhcHBsaWNhdGlvbiBjc3Mgc2NhZmZvbGQgc2hhcmVkXCIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciB9KTtcblxuICAgICAgICBjb25zdCBhc3NldENzc0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgYGFwcEZyYW1ld29yay9zaGFyZWQvY3NzLyR7dW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZS50b0xvd2VyQ2FzZSgpfWApO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IFtcImFwcFwiLCBcIm1haW5cIiwgXCJyZXNldFwiXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldENzc0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3N0eWxlfS4ke2VuZ2luZVZhcmlhYmxlcy5zdHlsZUxhbmd1YWdlRXh0fWAsIGVuZ2luZVZhcmlhYmxlcy53d3cuY3NzU3JjRm9sZGVyLCBgJHtzdHlsZX0uJHtlbmdpbmVWYXJpYWJsZXMuc3R5bGVMYW5ndWFnZUV4dH1gKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=
