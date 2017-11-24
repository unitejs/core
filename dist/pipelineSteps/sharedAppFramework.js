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
const pipelineStepBase_1 = require("../engine/pipelineStepBase");
const templateHelper_1 = require("../helpers/templateHelper");
class SharedAppFramework extends pipelineStepBase_1.PipelineStepBase {
    generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, files, isShared) {
        return __awaiter(this, void 0, void 0, function* () {
            const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();
            const scaffoldFolder = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${appFramework}/src/${uniteConfiguration.sourceLanguage.toLowerCase()}`);
            logger.info("Generating App Source in", { appSourceFolder: engineVariables.www.srcFolder });
            for (const file of files) {
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, file, engineVariables.www.srcFolder, file, engineVariables.force, engineVariables.noCreateSource, templateHelper_1.TemplateHelper.createCodeSubstitutions(engineVariables));
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
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${htmlFile}`, engineVariables.www.srcFolder, `${htmlFile}`, engineVariables.force, engineVariables.noCreateSource);
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
                const ret = yield this.copyFile(logger, fileSystem, scaffoldFolder, `${cssFile}.${uniteConfiguration.styleExtension}`, engineVariables.www.srcFolder, `${cssFile}.${uniteConfiguration.styleExtension}`, engineVariables.force, engineVariables.noCreateSource);
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
                const unitTestsRunner = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/shared/test/unit/unitTestRunner/${uniteConfiguration.unitTestRunner.toLowerCase()}/`);
                for (const spec of specs) {
                    const ret = yield this.copyFile(logger, fileSystem, unitTestsScaffold, `${spec}`, engineVariables.www.unitTestSrcFolder, `${spec}`, engineVariables.force, engineVariables.noCreateSource, templateHelper_1.TemplateHelper.createCodeSubstitutions(engineVariables));
                    if (ret !== 0) {
                        return ret;
                    }
                }
                return this.copyFile(logger, fileSystem, unitTestsRunner, "unit-bootstrap.js", engineVariables.www.unitTestFolder, "unit-bootstrap.js", engineVariables.force, engineVariables.noCreateSource);
            }
            else {
                return 0;
            }
        });
    }
    generateE2eTest(logger, fileSystem, uniteConfiguration, engineVariables, specs, isShared) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (!_super("condition").call(this, uniteConfiguration.e2eTestRunner, "None")) {
                logger.info("Generating e2e test scaffold shared", { unitTestSrcFolder: engineVariables.www.e2eTestSrcFolder });
                const appFramework = isShared ? "shared" : uniteConfiguration.applicationFramework.toLowerCase();
                const e2eTestsScaffold = fileSystem.pathCombine(engineVariables.engineAssetsFolder, `appFramework/${appFramework}/test/e2e/src/` +
                    `${uniteConfiguration.e2eTestRunner.toLowerCase()}/` +
                    `${uniteConfiguration.e2eTestFramework.toLowerCase()}/`);
                for (const spec of specs) {
                    const ret = yield this.copyFile(logger, fileSystem, e2eTestsScaffold, `${spec}`, engineVariables.www.e2eTestSrcFolder, `${spec}`, engineVariables.force, engineVariables.noCreateSource);
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
                const ret = yield _super("copyFile").call(this, logger, fileSystem, assetCssFolder, `${style}.${uniteConfiguration.styleExtension}`, engineVariables.www.cssSrcFolder, `${style}.${uniteConfiguration.styleExtension}`, engineVariables.force, engineVariables.noCreateSource);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
    createLoaderReplacement(engineVariables, extension, loader, includeRequires) {
        if (includeRequires) {
            engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
        }
        engineVariables.buildTranspilePreBuild.push(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).${extension}\\2/g, "import$1$2${loader}!$3.${extension}$2"))`);
    }
    createLoaderTypeMapReplacement(engineVariables, extension, loader) {
        engineVariables.buildTranspileInclude.push("const replace = require(\"gulp-replace\");");
        engineVariables.buildTranspileInclude.push("const clientPackages = require(\"./util/client-packages\");");
        const typeMapLoader = `\${clientPackages.getTypeMap(uniteConfig, "${loader}", buildConfiguration.minify)}`;
        engineVariables.buildTranspilePreBuild.push(`        .pipe(replace(/import(.*?)("|'|\`)(.*?).${extension}\\2/g, \`import$1$2${typeMapLoader}!$3.${extension}$2\`))`);
    }
}
exports.SharedAppFramework = SharedAppFramework;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NoYXJlZEFwcEZyYW1ld29yay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0EsaUVBQThEO0FBQzlELDhEQUEyRDtBQUUzRCx3QkFBeUMsU0FBUSxtQ0FBZ0I7SUFDN0MsaUJBQWlCLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxLQUFlLEVBQ2YsUUFBaUI7O1lBQy9DLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVqRyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFDbEMsZ0JBQWdCLFlBQVksUUFBUSxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXJJLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBRTVGLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUNsQixjQUFjLEVBQ2QsSUFBSSxFQUNKLGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUM3QixJQUFJLEVBQ0osZUFBZSxDQUFDLEtBQUssRUFDckIsZUFBZSxDQUFDLGNBQWMsRUFDOUIsK0JBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUV6RixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixNQUFNLENBQUMsR0FB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Q1osTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFUyx1QkFBdUIsQ0FBQyxlQUFnQyxFQUFFLFNBQWlCLEVBQUUsTUFBYyxFQUFFLGVBQXdCO1FBQzNILEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsZUFBZSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFDRCxlQUFlLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxTQUFTLHFCQUFxQixNQUFNLE9BQU8sU0FBUyxPQUFPLENBQUMsQ0FBQztJQUNoSyxDQUFDO0lBRVMsOEJBQThCLENBQUMsZUFBZ0MsRUFBRSxTQUFpQixFQUFFLE1BQWM7UUFDeEcsZUFBZSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBQ3pGLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUUxRyxNQUFNLGFBQWEsR0FBRyw4Q0FBOEMsTUFBTSxnQ0FBZ0MsQ0FBQztRQUMzRyxlQUFlLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxTQUFTLHNCQUFzQixhQUFhLE9BQU8sU0FBUyxRQUFRLENBQUMsQ0FBQztJQUN6SyxDQUFDO0NBQ0o7QUFyTUQsZ0RBcU1DIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2hhcmVkQXBwRnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBzaGFyZWQgYXBwbGljYXRpb24uXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IFRlbXBsYXRlSGVscGVyIH0gZnJvbSBcIi4uL2hlbHBlcnMvdGVtcGxhdGVIZWxwZXJcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXJlZEFwcEZyYW1ld29yayBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTaGFyZWQ6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBhcHBGcmFtZXdvcmsgPSBpc1NoYXJlZCA/IFwic2hhcmVkXCIgOiB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHthcHBGcmFtZXdvcmt9L3NyYy8ke3VuaXRlQ29uZmlndXJhdGlvbi5zb3VyY2VMYW5ndWFnZS50b0xvd2VyQ2FzZSgpfWApO1xuXG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBBcHAgU291cmNlIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FmZm9sZEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLm5vQ3JlYXRlU291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUZW1wbGF0ZUhlbHBlci5jcmVhdGVDb2RlU3Vic3RpdHV0aW9ucyhlbmdpbmVWYXJpYWJsZXMpKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBIdG1sKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxGaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjL2h0bWwvYCk7XG5cbiAgICAgICAgbG9nZ2VyLmluZm8oXCJHZW5lcmF0aW5nIEFwcCBIVE1MIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGh0bWxGaWxlIG9mIGh0bWxGaWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWZmb2xkRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtodG1sRmlsZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7aHRtbEZpbGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmZvcmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubm9DcmVhdGVTb3VyY2UpO1xuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVBcHBDc3MobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3NGaWxlczogc3RyaW5nW10pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBzY2FmZm9sZEZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcHBGcmFtZXdvcmsvJHt1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsudG9Mb3dlckNhc2UoKX0vc3JjL2Nzcy8ke3VuaXRlQ29uZmlndXJhdGlvbi5jc3NQcmUudG9Mb3dlckNhc2UoKX0vYCk7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBBcHAgQ1NTIGluXCIsIHsgYXBwU291cmNlRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LnNyY0ZvbGRlciB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNzc0ZpbGUgb2YgY3NzRmlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FmZm9sZEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7Y3NzRmlsZX0uJHt1bml0ZUNvbmZpZ3VyYXRpb24uc3R5bGVFeHRlbnNpb259YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3dy5zcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2Nzc0ZpbGV9LiR7dW5pdGVDb25maWd1cmF0aW9uLnN0eWxlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLm5vQ3JlYXRlU291cmNlKTtcblxuICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZ2VuZXJhdGVVbml0VGVzdChsb2dnZXI6IElMb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3M6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2hhcmVkOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKCFzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnVuaXRUZXN0UnVubmVyLCBcIk5vbmVcIikpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyB1bml0IHRlc3Qgc2NhZmZvbGQgc2hhcmVkXCIsIHsgdW5pdFRlc3RTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RTcmNGb2xkZXIgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFwcEZyYW1ld29yayA9IGlzU2hhcmVkID8gXCJzaGFyZWRcIiA6IHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yay50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBjb25zdCB1bml0VGVzdHNTY2FmZm9sZCA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrLyR7YXBwRnJhbWV3b3JrfS90ZXN0L3VuaXQvc3JjL3NvdXJjZUxhbmd1YWdlLyR7dW5pdGVDb25maWd1cmF0aW9uLnNvdXJjZUxhbmd1YWdlLnRvTG93ZXJDYXNlKCl9L2AgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3VuaXRlQ29uZmlndXJhdGlvbi51bml0VGVzdEZyYW1ld29yay50b0xvd2VyQ2FzZSgpfS9gKTtcblxuICAgICAgICAgICAgY29uc3QgdW5pdFRlc3RzUnVubmVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZShlbmdpbmVWYXJpYWJsZXMuZW5naW5lQXNzZXRzRm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrL3NoYXJlZC90ZXN0L3VuaXQvdW5pdFRlc3RSdW5uZXIvJHt1bml0ZUNvbmZpZ3VyYXRpb24udW5pdFRlc3RSdW5uZXIudG9Mb3dlckNhc2UoKX0vYCk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qgc3BlYyBvZiBzcGVjcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHRoaXMuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0VGVzdHNTY2FmZm9sZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RTcmNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHtzcGVjfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubm9DcmVhdGVTb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUZW1wbGF0ZUhlbHBlci5jcmVhdGVDb2RlU3Vic3RpdHV0aW9ucyhlbmdpbmVWYXJpYWJsZXMpKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3B5RmlsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRUZXN0c1J1bm5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdC1ib290c3RyYXAuanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cudW5pdFRlc3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuaXQtYm9vdHN0cmFwLmpzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubm9DcmVhdGVTb3VyY2UpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBnZW5lcmF0ZUUyZVRlc3QobG9nZ2VyOiBJTG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3M6IHN0cmluZ1tdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTaGFyZWQ6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAoIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciwgXCJOb25lXCIpKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkdlbmVyYXRpbmcgZTJlIHRlc3Qgc2NhZmZvbGQgc2hhcmVkXCIsIHsgdW5pdFRlc3RTcmNGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdFNyY0ZvbGRlciB9KTtcblxuICAgICAgICAgICAgY29uc3QgYXBwRnJhbWV3b3JrID0gaXNTaGFyZWQgPyBcInNoYXJlZFwiIDogdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGUyZVRlc3RzU2NhZmZvbGQgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXBwRnJhbWV3b3JrLyR7YXBwRnJhbWV3b3JrfS90ZXN0L2UyZS9zcmMvYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgJHt1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lci50b0xvd2VyQ2FzZSgpfS9gICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3VuaXRlQ29uZmlndXJhdGlvbi5lMmVUZXN0RnJhbWV3b3JrLnRvTG93ZXJDYXNlKCl9L2ApO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNwZWMgb2Ygc3BlY3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCB0aGlzLmNvcHlGaWxlKGxvZ2dlciwgZmlsZVN5c3RlbSwgZTJlVGVzdHNTY2FmZm9sZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3cuZTJlVGVzdFNyY0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3NwZWN9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5ub0NyZWF0ZVNvdXJjZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGdlbmVyYXRlQ3NzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiR2VuZXJhdGluZyBhcHBsaWNhdGlvbiBjc3Mgc2NhZmZvbGQgc2hhcmVkXCIsIHsgY3NzU3JjRm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciB9KTtcblxuICAgICAgICBjb25zdCBhc3NldENzc0ZvbGRlciA9IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoZW5naW5lVmFyaWFibGVzLmVuZ2luZUFzc2V0c0ZvbGRlciwgYGFwcEZyYW1ld29yay9zaGFyZWQvY3NzLyR7dW5pdGVDb25maWd1cmF0aW9uLmNzc1ByZS50b0xvd2VyQ2FzZSgpfWApO1xuXG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IFtcImFwcFwiLCBcIm1haW5cIiwgXCJyZXNldFwiXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgc3VwZXIuY29weUZpbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBhc3NldENzc0ZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke3N0eWxlfS4ke3VuaXRlQ29uZmlndXJhdGlvbi5zdHlsZUV4dGVuc2lvbn1gLCBlbmdpbmVWYXJpYWJsZXMud3d3LmNzc1NyY0ZvbGRlciwgYCR7c3R5bGV9LiR7dW5pdGVDb25maWd1cmF0aW9uLnN0eWxlRXh0ZW5zaW9ufWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZm9yY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMubm9DcmVhdGVTb3VyY2UpO1xuXG4gICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjcmVhdGVMb2FkZXJSZXBsYWNlbWVudChlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgZXh0ZW5zaW9uOiBzdHJpbmcsIGxvYWRlcjogc3RyaW5nLCBpbmNsdWRlUmVxdWlyZXM6IGJvb2xlYW4pIDogdm9pZCB7XG4gICAgICAgIGlmIChpbmNsdWRlUmVxdWlyZXMpIHtcbiAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5idWlsZFRyYW5zcGlsZUluY2x1ZGUucHVzaChcImNvbnN0IHJlcGxhY2UgPSByZXF1aXJlKFxcXCJndWxwLXJlcGxhY2VcXFwiKTtcIik7XG4gICAgICAgIH1cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkVHJhbnNwaWxlUHJlQnVpbGQucHVzaChgICAgICAgICAucGlwZShyZXBsYWNlKC9pbXBvcnQoLio/KShcInwnfFxcYCkoLio/KS4ke2V4dGVuc2lvbn1cXFxcMi9nLCBcImltcG9ydCQxJDIke2xvYWRlcn0hJDMuJHtleHRlbnNpb259JDJcIikpYCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUxvYWRlclR5cGVNYXBSZXBsYWNlbWVudChlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgZXh0ZW5zaW9uOiBzdHJpbmcsIGxvYWRlcjogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYnVpbGRUcmFuc3BpbGVJbmNsdWRlLnB1c2goXCJjb25zdCByZXBsYWNlID0gcmVxdWlyZShcXFwiZ3VscC1yZXBsYWNlXFxcIik7XCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuYnVpbGRUcmFuc3BpbGVJbmNsdWRlLnB1c2goXCJjb25zdCBjbGllbnRQYWNrYWdlcyA9IHJlcXVpcmUoXFxcIi4vdXRpbC9jbGllbnQtcGFja2FnZXNcXFwiKTtcIik7XG5cbiAgICAgICAgY29uc3QgdHlwZU1hcExvYWRlciA9IGBcXCR7Y2xpZW50UGFja2FnZXMuZ2V0VHlwZU1hcCh1bml0ZUNvbmZpZywgXCIke2xvYWRlcn1cIiwgYnVpbGRDb25maWd1cmF0aW9uLm1pbmlmeSl9YDtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLmJ1aWxkVHJhbnNwaWxlUHJlQnVpbGQucHVzaChgICAgICAgICAucGlwZShyZXBsYWNlKC9pbXBvcnQoLio/KShcInwnfFxcYCkoLio/KS4ke2V4dGVuc2lvbn1cXFxcMi9nLCBcXGBpbXBvcnQkMSQyJHt0eXBlTWFwTG9hZGVyfSEkMy4ke2V4dGVuc2lvbn0kMlxcYCkpYCk7XG4gICAgfVxufVxuIl19
