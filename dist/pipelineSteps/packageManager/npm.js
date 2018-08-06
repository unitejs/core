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
 * Pipeline step for Npm.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
const packageUtils_1 = require("../packageUtils");
class Npm extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.packageManager, "Npm");
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitIgnoreConfiguration = engineVariables.getConfiguration("GitIgnore");
            if (gitIgnoreConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(typeScriptConfiguration.exclude, "node_modules", mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(javaScriptConfiguration.exclude, "node_modules", mainCondition);
            }
            return 0;
        });
    }
    info(logger, fileSystem, packageName, version) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Looking up package info...");
            const args = ["view", `${packageName}${version !== null && version !== undefined ? `@${version}` : ""}`, "--json", "name", "version", "main"];
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", undefined, args)
                .then(viewData => JSON.parse(viewData))
                .catch((err) => {
                throw new Error(`No package information found: ${err}`);
            });
        });
    }
    add(logger, fileSystem, workingDirectory, packageName, version, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Adding package...");
            const args = ["install", `${packageName}@${version}`];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save-prod");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
        });
    }
    remove(logger, fileSystem, workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Removing package...");
            const args = ["uninstall", packageName];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
        });
    }
    getInstallCommand(packageName, isGlobal) {
        const parts = [];
        parts.push("npm");
        if (isGlobal) {
            parts.push("-g");
        }
        parts.push("install");
        if (packageName && packageName.length > 0) {
            parts.push(packageName);
        }
        return parts.join(" ");
    }
}
exports.Npm = Npm;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL25wbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFRekUsb0VBQWlFO0FBRWpFLGtEQUErQztBQUUvQyxNQUFhLEdBQUksU0FBUSxtQ0FBZ0I7SUFDOUIsYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBVyxXQUFXLENBQUMsQ0FBQztZQUN2RixJQUFJLHNCQUFzQixFQUFFO2dCQUN4Qix5QkFBVyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDaEY7WUFFRCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsSUFBSSx1QkFBdUIsRUFBRTtnQkFDekIseUJBQVcsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUN6RjtZQUVELE1BQU0sdUJBQXVCLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUEwQixZQUFZLENBQUMsQ0FBQztZQUN4RyxJQUFJLHVCQUF1QixFQUFFO2dCQUN6Qix5QkFBVyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxJQUFJLENBQUMsTUFBZSxF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QU0sR0FBRyxDQUFDLEVBQUU7WUFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0o7QUFwRkQsa0JBb0ZDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGFja2FnZU1hbmFnZXIvbnBtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIGZvciBOcG0uXG4gKi9cbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9hcnJheUhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVHlwZVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHlwZVNjcmlwdC90eXBlU2NyaXB0Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdnNjb2RlL2phdmFTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBOcG0gZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIGltcGxlbWVudHMgSVBhY2thZ2VNYW5hZ2VyIHtcbiAgICBwdWJsaWMgbWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpIDogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBcIk5wbVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGdpdElnbm9yZUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJHaXRJZ25vcmVcIik7XG4gICAgICAgIGlmIChnaXRJZ25vcmVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoZ2l0SWdub3JlQ29uZmlndXJhdGlvbiwgXCJub2RlX21vZHVsZXNcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPFR5cGVTY3JpcHRDb25maWd1cmF0aW9uPihcIlR5cGVTY3JpcHRcIik7XG4gICAgICAgIGlmICh0eXBlU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uLmV4Y2x1ZGUsIFwibm9kZV9tb2R1bGVzXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgamF2YVNjcmlwdENvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxKYXZhU2NyaXB0Q29uZmlndXJhdGlvbj4oXCJKYXZhU2NyaXB0XCIpO1xuICAgICAgICBpZiAoamF2YVNjcmlwdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShqYXZhU2NyaXB0Q29uZmlndXJhdGlvbi5leGNsdWRlLCBcIm5vZGVfbW9kdWxlc1wiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbmZvKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZyk6IFByb21pc2U8UGFja2FnZUNvbmZpZ3VyYXRpb24+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJMb29raW5nIHVwIHBhY2thZ2UgaW5mby4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widmlld1wiLCBgJHtwYWNrYWdlTmFtZX0ke3ZlcnNpb24gIT09IG51bGwgJiYgdmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gYEAke3ZlcnNpb259YCA6IFwiXCJ9YCwgXCItLWpzb25cIiwgXCJuYW1lXCIsIFwidmVyc2lvblwiLCBcIm1haW5cIl07XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlciwgZmlsZVN5c3RlbSwgXCJucG1cIiwgdW5kZWZpbmVkLCBhcmdzKVxuICAgICAgICAgICAgLnRoZW4odmlld0RhdGEgPT4gSlNPTi5wYXJzZSh2aWV3RGF0YSkpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcGFja2FnZSBpbmZvcm1hdGlvbiBmb3VuZDogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYWRkKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcImluc3RhbGxcIiwgYCR7cGFja2FnZU5hbWV9QCR7dmVyc2lvbn1gXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmUtcHJvZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwibnBtXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBwYWNrYWdlOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZW1vdmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiUmVtb3ZpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widW5pbnN0YWxsXCIsIHBhY2thZ2VOYW1lXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyLCBmaWxlU3lzdGVtLCBcIm5wbVwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZW1vdmUgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SW5zdGFsbENvbW1hbmQocGFja2FnZU5hbWU6IHN0cmluZywgaXNHbG9iYWw6IGJvb2xlYW4pIDogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBbXTtcblxuICAgICAgICBwYXJ0cy5wdXNoKFwibnBtXCIpO1xuICAgICAgICBpZiAoaXNHbG9iYWwpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goXCItZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJ0cy5wdXNoKFwiaW5zdGFsbFwiKTtcbiAgICAgICAgaWYgKHBhY2thZ2VOYW1lICYmIHBhY2thZ2VOYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gocGFja2FnZU5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCIgXCIpO1xuICAgIH1cbn1cbiJdfQ==
