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
const sharedAppFramework_1 = require("./sharedAppFramework");
class Aurelia extends sharedAppFramework_1.SharedAppFramework {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                if (uniteConfiguration.bundler === "Browserify" || uniteConfiguration.bundler === "Webpack") {
                    logger.error(`Aurelia does not currently support bundling with ${uniteConfiguration.bundler}`);
                    return 1;
                }
            }
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["aurelia-protractor-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "Protractor");
            engineVariables.toggleDevDependency(["unitejs-aurelia-webdriver-plugin"], uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.e2eTestRunner === "WebdriverIO");
            this.toggleAllPackages(uniteConfiguration, engineVariables);
            if (uniteConfiguration.applicationFramework === "Aurelia") {
                const protractorConfiguration = engineVariables.getConfiguration("Protractor");
                if (protractorConfiguration) {
                    const plugin = fileSystem.pathToWeb(fileSystem.pathFileRelative(engineVariables.wwwRootFolder, fileSystem.pathCombine(engineVariables.www.packageFolder, "aurelia-protractor-plugin")));
                    protractorConfiguration.plugins.push({ path: plugin });
                }
                const webdriverIoPlugins = engineVariables.getConfiguration("WebdriverIO.Plugins");
                if (webdriverIoPlugins) {
                    webdriverIoPlugins.push("unitejs-aurelia-webdriver-plugin");
                }
                let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper", "entryPoint", "child/child"]);
                if (ret === 0) {
                    ret = yield _super("generateAppHtml").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app", "child/child"]);
                    if (ret === 0) {
                        ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["child/child"]);
                        if (ret === 0) {
                            ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app"]);
                            if (ret === 0) {
                                ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, ["app", "bootstrapper"], true);
                                if (ret === 0) {
                                    ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
                                }
                            }
                        }
                    }
                }
                return ret;
            }
            return 0;
        });
    }
    toggleAllPackages(uniteConfiguration, engineVariables) {
        let location = "dist/";
        if (uniteConfiguration.moduleType === "AMD") {
            location += "amd/";
        }
        else if (uniteConfiguration.moduleType === "CommonJS") {
            location += "commonjs/";
        }
        else {
            location += "system/";
        }
        this.toggleClientPackages(uniteConfiguration, engineVariables, location, [
            { name: "aurelia-animator-css" },
            { name: "aurelia-binding" },
            { name: "aurelia-bootstrapper" },
            { name: "aurelia-dependency-injection" },
            { name: "aurelia-event-aggregator" },
            { name: "aurelia-fetch-client" },
            { name: "aurelia-http-client" },
            { name: "aurelia-framework" },
            { name: "aurelia-history" },
            { name: "aurelia-history-browser" },
            { name: "aurelia-loader" },
            { name: "aurelia-loader-default" },
            { name: "aurelia-logging" },
            { name: "aurelia-logging-console" },
            { name: "aurelia-metadata" },
            { name: "aurelia-pal" },
            { name: "aurelia-pal-browser" },
            { name: "aurelia-path" },
            { name: "aurelia-polyfills" },
            { name: "aurelia-route-recognizer" },
            { name: "aurelia-router" },
            { name: "aurelia-task-queue" },
            { name: "aurelia-templating" },
            { name: "aurelia-templating-binding" },
            { name: "aurelia-dialog", isPackage: true },
            { name: "aurelia-templating-resources", isPackage: true },
            { name: "aurelia-templating-router", isPackage: true },
            { name: "aurelia-validation", isPackage: true }
        ]);
        engineVariables.toggleClientPackage("whatwg-fetch", "fetch.js", undefined, undefined, false, "both", "none", false, undefined, undefined, undefined, uniteConfiguration.applicationFramework === "Aurelia");
        engineVariables.toggleClientPackage("requirejs-text", "text.js", undefined, undefined, false, "both", "none", false, undefined, "text", undefined, uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.moduleType === "AMD");
        engineVariables.toggleClientPackage("systemjs-plugin-text", "text.js", undefined, undefined, false, "both", "none", false, undefined, "text", undefined, uniteConfiguration.applicationFramework === "Aurelia" && uniteConfiguration.moduleType === "SystemJS");
    }
    toggleClientPackages(uniteConfiguration, engineVariables, location, clientPackages) {
        clientPackages.forEach(clientPackage => {
            engineVariables.toggleClientPackage(clientPackage.name, `${location}${clientPackage.name}.js`, undefined, undefined, false, "both", "none", clientPackage.isPackage ? true : false, undefined, undefined, undefined, uniteConfiguration.applicationFramework === "Aurelia");
        });
    }
}
exports.Aurelia = Aurelia;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2FwcGxpY2F0aW9uRnJhbWV3b3JrL2F1cmVsaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLDZEQUEwRDtBQUUxRCxhQUFxQixTQUFRLHVDQUFrQjtJQUM5QixVQUFVLENBQUMsTUFBZSxFQUNmLFVBQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxlQUFnQzs7WUFDcEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDL0YsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLG9CQUFvQixLQUFLLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLEtBQUssWUFBWSxDQUFDLENBQUM7WUFDL0ssZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsa0NBQWtDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLElBQUksa0JBQWtCLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxDQUFDO1lBRXZMLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUU1RCxFQUFFLENBQUMsQ0FBQyxr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QyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUM7SUFDL0csQ0FBQztJQUVPLG9CQUFvQixDQUFDLGtCQUFzQyxFQUN0QyxlQUFnQyxFQUNoQyxRQUFnQixFQUNoQixjQUF1RDtRQUVoRixjQUFjLENBQUMsT0FBTyxDQUFDLGFBQWE7WUFDaEMsZUFBZSxDQUFDLG1CQUFtQixDQUMvQixhQUFhLENBQUMsSUFBSSxFQUNsQixHQUFHLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxLQUFLLEVBQ3JDLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUN0QyxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXJLRCwwQkFxS0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9hcHBsaWNhdGlvbkZyYW1ld29yay9hdXJlbGlhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIHNjYWZmb2xkaW5nIGZvciBBdXJlbGlhIGFwcGxpY2F0aW9uLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFByb3RyYWN0b3JDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3Byb3RyYWN0b3IvcHJvdHJhY3RvckNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi9zaGFyZWRBcHBGcmFtZXdvcmtcIjtcblxuZXhwb3J0IGNsYXNzIEF1cmVsaWEgZXh0ZW5kcyBTaGFyZWRBcHBGcmFtZXdvcmsge1xuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiKSB7XG4gICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXIgPT09IFwiQnJvd3NlcmlmeVwiIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5idW5kbGVyID09PSBcIldlYnBhY2tcIikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQXVyZWxpYSBkb2VzIG5vdCBjdXJyZW50bHkgc3VwcG9ydCBidW5kbGluZyB3aXRoICR7dW5pdGVDb25maWd1cmF0aW9uLmJ1bmRsZXJ9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZURldkRlcGVuZGVuY3koW1wiYXVyZWxpYS1wcm90cmFjdG9yLXBsdWdpblwiXSwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlRGV2RGVwZW5kZW5jeShbXCJ1bml0ZWpzLWF1cmVsaWEtd2ViZHJpdmVyLXBsdWdpblwiXSwgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24uZTJlVGVzdFJ1bm5lciA9PT0gXCJXZWJkcml2ZXJJT1wiKTtcblxuICAgICAgICB0aGlzLnRvZ2dsZUFsbFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcblxuICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIikge1xuICAgICAgICAgICAgY29uc3QgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxQcm90cmFjdG9yQ29uZmlndXJhdGlvbj4oXCJQcm90cmFjdG9yXCIpO1xuICAgICAgICAgICAgaWYgKHByb3RyYWN0b3JDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGx1Z2luID0gZmlsZVN5c3RlbS5wYXRoVG9XZWIoZmlsZVN5c3RlbS5wYXRoRmlsZVJlbGF0aXZlKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKGVuZ2luZVZhcmlhYmxlcy53d3cucGFja2FnZUZvbGRlciwgXCJhdXJlbGlhLXByb3RyYWN0b3ItcGx1Z2luXCIpKSk7XG4gICAgICAgICAgICAgICAgcHJvdHJhY3RvckNvbmZpZ3VyYXRpb24ucGx1Z2lucy5wdXNoKHsgcGF0aDogcGx1Z2luIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd2ViZHJpdmVySW9QbHVnaW5zID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248c3RyaW5nW10+KFwiV2ViZHJpdmVySU8uUGx1Z2luc1wiKTtcbiAgICAgICAgICAgIGlmICh3ZWJkcml2ZXJJb1BsdWdpbnMpIHtcbiAgICAgICAgICAgICAgICB3ZWJkcml2ZXJJb1BsdWdpbnMucHVzaChcInVuaXRlanMtYXVyZWxpYS13ZWJkcml2ZXItcGx1Z2luXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHBcIiwgXCJib290c3RyYXBwZXJcIiwgXCJlbnRyeVBvaW50XCIsIFwiY2hpbGQvY2hpbGRcIl0pO1xuXG4gICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVBcHBIdG1sKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiLCBcImNoaWxkL2NoaWxkXCJdKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVBcHBDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiY2hpbGQvY2hpbGRcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlRTJlVGVzdChsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbXCJhcHBcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZVVuaXRUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtcImFwcFwiLCBcImJvb3RzdHJhcHBlclwiXSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZUFsbFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IHZvaWQge1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBcImRpc3QvXCI7XG5cbiAgICAgICAgaWYgKHVuaXRlQ29uZmlndXJhdGlvbi5tb2R1bGVUeXBlID09PSBcIkFNRFwiKSB7XG4gICAgICAgICAgICBsb2NhdGlvbiArPSBcImFtZC9cIjtcbiAgICAgICAgfSBlbHNlIGlmICh1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJDb21tb25KU1wiKSB7XG4gICAgICAgICAgICBsb2NhdGlvbiArPSBcImNvbW1vbmpzL1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gKz0gXCJzeXN0ZW0vXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvZ2dsZUNsaWVudFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBsb2NhdGlvbiwgW1xuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtYW5pbWF0b3ItY3NzXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWJpbmRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtYm9vdHN0cmFwcGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWRlcGVuZGVuY3ktaW5qZWN0aW9uXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWV2ZW50LWFnZ3JlZ2F0b3JcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWh0dHAtY2xpZW50XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWZyYW1ld29ya1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1oaXN0b3J5XCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLWhpc3RvcnktYnJvd3NlclwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2FkZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9hZGVyLWRlZmF1bHRcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbG9nZ2luZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS1sb2dnaW5nLWNvbnNvbGVcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtbWV0YWRhdGFcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcGFsXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhbC1icm93c2VyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXBhdGhcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcG9seWZpbGxzXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXJvdXRlLXJlY29nbml6ZXJcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtcm91dGVyXCIgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXRhc2stcXVldWVcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZ1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nLWJpbmRpbmdcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtZGlhbG9nXCIsIGlzUGFja2FnZTogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImF1cmVsaWEtdGVtcGxhdGluZy1yZXNvdXJjZXNcIiwgaXNQYWNrYWdlOiB0cnVlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXVyZWxpYS10ZW1wbGF0aW5nLXJvdXRlclwiLCBpc1BhY2thZ2U6IHRydWUgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhdXJlbGlhLXZhbGlkYXRpb25cIiwgaXNQYWNrYWdlOiB0cnVlIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzLnRvZ2dsZUNsaWVudFBhY2thZ2UoXG4gICAgICAgICAgICBcIndoYXR3Zy1mZXRjaFwiLFxuICAgICAgICAgICAgXCJmZXRjaC5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIFwibm9uZVwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb24uYXBwbGljYXRpb25GcmFtZXdvcmsgPT09IFwiQXVyZWxpYVwiKTtcblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgIFwicmVxdWlyZWpzLXRleHRcIixcbiAgICAgICAgICAgIFwidGV4dC5qc1wiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBcImJvdGhcIixcbiAgICAgICAgICAgIFwibm9uZVwiLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBcInRleHRcIixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIgJiYgdW5pdGVDb25maWd1cmF0aW9uLm1vZHVsZVR5cGUgPT09IFwiQU1EXCIpO1xuXG4gICAgICAgIGVuZ2luZVZhcmlhYmxlcy50b2dnbGVDbGllbnRQYWNrYWdlKFxuICAgICAgICAgICAgXCJzeXN0ZW1qcy1wbHVnaW4tdGV4dFwiLFxuICAgICAgICAgICAgXCJ0ZXh0LmpzXCIsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgXCJub25lXCIsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIFwidGV4dFwiLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uLmFwcGxpY2F0aW9uRnJhbWV3b3JrID09PSBcIkF1cmVsaWFcIiAmJiB1bml0ZUNvbmZpZ3VyYXRpb24ubW9kdWxlVHlwZSA9PT0gXCJTeXN0ZW1KU1wiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvZ2dsZUNsaWVudFBhY2thZ2VzKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFja2FnZXM6IHsgbmFtZTogc3RyaW5nOyBpc1BhY2thZ2U/OiBib29sZWFuIH1bXSk6IHZvaWQge1xuXG4gICAgICAgIGNsaWVudFBhY2thZ2VzLmZvckVhY2goY2xpZW50UGFja2FnZSA9PiB7XG4gICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMudG9nZ2xlQ2xpZW50UGFja2FnZShcbiAgICAgICAgICAgICAgICBjbGllbnRQYWNrYWdlLm5hbWUsXG4gICAgICAgICAgICAgICAgYCR7bG9jYXRpb259JHtjbGllbnRQYWNrYWdlLm5hbWV9LmpzYCxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiYm90aFwiLFxuICAgICAgICAgICAgICAgIFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIGNsaWVudFBhY2thZ2UuaXNQYWNrYWdlID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5hcHBsaWNhdGlvbkZyYW1ld29yayA9PT0gXCJBdXJlbGlhXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
