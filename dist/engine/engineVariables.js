"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniteClientPackage_1 = require("../configuration/models/unite/uniteClientPackage");
class EngineVariables {
    constructor() {
        this._configuration = {};
        this.buildTranspileInclude = [];
        this.buildTranspilePreBuild = [];
        this.buildTranspilePostBuild = [];
        this._requiredDevDependencies = [];
        this._removedDevDependencies = [];
        this._requiredClientPackages = {};
        this._removedClientPackages = {};
    }
    setConfiguration(name, config) {
        this._configuration[name] = config;
    }
    getConfiguration(name) {
        return this._configuration[name];
    }
    setupDirectories(fileSystem, rootFolder) {
        this.rootFolder = rootFolder;
        this.wwwRootFolder = fileSystem.pathCombine(this.rootFolder, "www");
        this.packagedRootFolder = fileSystem.pathCombine(this.rootFolder, "packaged");
        this.www = {
            srcFolder: fileSystem.pathCombine(this.wwwRootFolder, "src"),
            distFolder: fileSystem.pathCombine(this.wwwRootFolder, "dist"),
            cssSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "cssSrc"),
            cssDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "css"),
            e2eTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e"),
            e2eTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/src"),
            e2eTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/e2e/dist"),
            unitTestFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit"),
            unitTestSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/src"),
            unitTestDistFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/unit/dist"),
            reportsFolder: fileSystem.pathCombine(this.wwwRootFolder, "test/reports"),
            assetsFolder: fileSystem.pathCombine(this.wwwRootFolder, "assets"),
            assetsSrcFolder: fileSystem.pathCombine(this.wwwRootFolder, "assetsSrc"),
            buildFolder: fileSystem.pathCombine(this.wwwRootFolder, "build"),
            packageFolder: fileSystem.pathCombine(this.wwwRootFolder, "node_modules")
        };
    }
    initialisePackages(clientPackages) {
        this._requiredClientPackages = clientPackages;
    }
    toggleClientPackage(name, main, mainMinified, testingAdditions, preload, includeMode, scriptIncludeMode, isPackage, assets, map, loaders, isModuleLoader, required) {
        const clientPackage = new uniteClientPackage_1.UniteClientPackage();
        clientPackage.includeMode = includeMode;
        clientPackage.preload = preload;
        clientPackage.main = main;
        clientPackage.mainMinified = mainMinified;
        clientPackage.testingAdditions = testingAdditions;
        clientPackage.isPackage = isPackage;
        clientPackage.version = this.findDependencyVersion(name);
        clientPackage.assets = assets;
        clientPackage.map = map;
        clientPackage.loaders = loaders;
        clientPackage.scriptIncludeMode = scriptIncludeMode;
        clientPackage.isModuleLoader = isModuleLoader;
        let opArr;
        if (required) {
            opArr = this._requiredClientPackages;
        }
        else {
            opArr = this._removedClientPackages;
        }
        opArr[name] = clientPackage;
    }
    toggleDevDependency(dependencies, required) {
        let opArr;
        if (required) {
            opArr = this._requiredDevDependencies;
        }
        else {
            opArr = this._removedDevDependencies;
        }
        dependencies.forEach(dep => {
            if (opArr.indexOf(dep) < 0) {
                opArr.push(dep);
            }
        });
    }
    buildDependencies(uniteConfiguration, packageJsonDependencies) {
        for (const key in this._removedClientPackages) {
            if (packageJsonDependencies[key]) {
                delete packageJsonDependencies[key];
            }
        }
        const addedTestDependencies = [];
        const removedTestDependencies = [];
        for (const pkg in this._requiredClientPackages) {
            uniteConfiguration.clientPackages[pkg] = this._requiredClientPackages[pkg];
            if (this._requiredClientPackages[pkg].includeMode === "app" || this._requiredClientPackages[pkg].includeMode === "both") {
                packageJsonDependencies[pkg] = this._requiredClientPackages[pkg].version;
                const idx = this._requiredDevDependencies.indexOf(pkg);
                if (idx >= 0) {
                    this._requiredDevDependencies.splice(idx, 1);
                    removedTestDependencies.push(pkg);
                }
            }
            else {
                addedTestDependencies.push(pkg);
            }
        }
        this.toggleDevDependency(addedTestDependencies, true);
        this.toggleDevDependency(removedTestDependencies, false);
    }
    buildDevDependencies(packageJsonDevDependencies) {
        this._removedDevDependencies.forEach(dependency => {
            if (packageJsonDevDependencies[dependency]) {
                delete packageJsonDevDependencies[dependency];
            }
        });
        this._requiredDevDependencies.forEach(requiredDependency => {
            packageJsonDevDependencies[requiredDependency] = this.findDependencyVersion(requiredDependency);
        });
    }
    findDependencyVersion(requiredDependency) {
        if (this.enginePackageJson && this.enginePackageJson.peerDependencies) {
            if (this.enginePackageJson.peerDependencies[requiredDependency]) {
                return this.enginePackageJson.peerDependencies[requiredDependency];
            }
            else {
                throw new Error(`Missing Dependency '${requiredDependency}'`);
            }
        }
        else {
            throw new Error("Dependency Versions missing");
        }
    }
}
exports.EngineVariables = EngineVariables;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEseUZBQXNGO0FBSXRGO0lBNENJO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFFbEMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsSUFBWSxFQUFFLE1BQVc7UUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDdkMsQ0FBQztJQUVNLGdCQUFnQixDQUFJLElBQVk7UUFDbkMsTUFBTSxDQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFVBQXVCLEVBQUUsVUFBa0I7UUFDL0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsR0FBRyxHQUFHO1lBQ1AsU0FBUyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFB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QUN6QyxPQUFPLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xELENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1lBQ3BELDBCQUEwQixDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEcsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0scUJBQXFCLENBQUMsa0JBQTBCO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixrQkFBa0IsR0FBRyxDQUFDLENBQUM7WUFDbEUsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNuRCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBbE1ELDBDQWtNQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lVmFyaWFibGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBWYXJpYWJsZXMgdXNlZCBieSB0aGUgZW5naW5lLlxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJU3BkeExpY2Vuc2UgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvc3BkeC9JU3BkeExpY2Vuc2VcIjtcbmltcG9ydCB7IEluY2x1ZGVNb2RlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL2luY2x1ZGVNb2RlXCI7XG5pbXBvcnQgeyBTY3JpcHRJbmNsdWRlTW9kZSB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS9zY3JpcHRJbmNsdWRlTW9kZVwiO1xuaW1wb3J0IHsgVW5pdGVDbGllbnRQYWNrYWdlIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ2xpZW50UGFja2FnZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBFbmdpbmVWYXJpYWJsZXMge1xuICAgIHB1YmxpYyBmb3JjZTogYm9vbGVhbjtcbiAgICBwdWJsaWMgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBlbmdpbmVBc3NldHNGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW5naW5lUGFja2FnZUpzb246IFBhY2thZ2VDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIHJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwdWJsaWMgd3d3Um9vdEZvbGRlcjogc3RyaW5nO1xuICAgIHB1YmxpYyBwYWNrYWdlZFJvb3RGb2xkZXI6IHN0cmluZztcblxuICAgIHB1YmxpYyB3d3c6IHtcbiAgICAgICAgc3JjRm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGRpc3RGb2xkZXI6IHN0cmluZztcbiAgICAgICAgdW5pdFRlc3RGb2xkZXI6IHN0cmluZztcbiAgICAgICAgdW5pdFRlc3RTcmNGb2xkZXI6IHN0cmluZztcbiAgICAgICAgdW5pdFRlc3REaXN0Rm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGNzc1NyY0ZvbGRlcjogc3RyaW5nO1xuICAgICAgICBjc3NEaXN0Rm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIGUyZVRlc3RGb2xkZXI6IHN0cmluZztcbiAgICAgICAgZTJlVGVzdFNyY0ZvbGRlcjogc3RyaW5nO1xuICAgICAgICBlMmVUZXN0RGlzdEZvbGRlcjogc3RyaW5nO1xuICAgICAgICByZXBvcnRzRm9sZGVyOiBzdHJpbmc7XG4gICAgICAgIHBhY2thZ2VGb2xkZXI6IHN0cmluZztcbiAgICAgICAgYnVpbGRGb2xkZXI6IHN0cmluZztcblxuICAgICAgICBhc3NldHNGb2xkZXI6IHN0cmluZztcbiAgICAgICAgYXNzZXRzU3JjRm9sZGVyOiBzdHJpbmc7XG4gICAgfTtcblxuICAgIHB1YmxpYyBsaWNlbnNlOiBJU3BkeExpY2Vuc2U7XG5cbiAgICBwdWJsaWMgYnVpbGRUcmFuc3BpbGVJbmNsdWRlOiBzdHJpbmdbXTtcbiAgICBwdWJsaWMgYnVpbGRUcmFuc3BpbGVQcmVCdWlsZDogc3RyaW5nW107XG4gICAgcHVibGljIGJ1aWxkVHJhbnNwaWxlUG9zdEJ1aWxkOiBzdHJpbmdbXTtcblxuICAgIHB1YmxpYyBwYWNrYWdlTWFuYWdlcjogSVBhY2thZ2VNYW5hZ2VyO1xuXG4gICAgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogeyBbaWQ6IHN0cmluZ106IGFueSB9O1xuXG4gICAgcHJpdmF0ZSBfcmVxdWlyZWREZXZEZXBlbmRlbmNpZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3JlbW92ZWREZXZEZXBlbmRlbmNpZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3JlcXVpcmVkQ2xpZW50UGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcbiAgICBwcml2YXRlIF9yZW1vdmVkQ2xpZW50UGFja2FnZXM6IHsgW2lkOiBzdHJpbmddOiBVbml0ZUNsaWVudFBhY2thZ2UgfTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uID0ge307XG5cbiAgICAgICAgdGhpcy5idWlsZFRyYW5zcGlsZUluY2x1ZGUgPSBbXTtcbiAgICAgICAgdGhpcy5idWlsZFRyYW5zcGlsZVByZUJ1aWxkID0gW107XG4gICAgICAgIHRoaXMuYnVpbGRUcmFuc3BpbGVQb3N0QnVpbGQgPSBbXTtcblxuICAgICAgICB0aGlzLl9yZXF1aXJlZERldkRlcGVuZGVuY2llcyA9IFtdO1xuICAgICAgICB0aGlzLl9yZW1vdmVkRGV2RGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZENsaWVudFBhY2thZ2VzID0ge307XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbmZpZ3VyYXRpb24obmFtZTogc3RyaW5nLCBjb25maWc6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jb25maWd1cmF0aW9uW25hbWVdID0gY29uZmlnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb25maWd1cmF0aW9uPFQ+KG5hbWU6IHN0cmluZyk6IFQge1xuICAgICAgICByZXR1cm4gPFQ+dGhpcy5fY29uZmlndXJhdGlvbltuYW1lXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0dXBEaXJlY3RvcmllcyhmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcm9vdEZvbGRlcjogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnJvb3RGb2xkZXIgPSByb290Rm9sZGVyO1xuICAgICAgICB0aGlzLnd3d1Jvb3RGb2xkZXIgPSBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMucm9vdEZvbGRlciwgXCJ3d3dcIik7XG4gICAgICAgIHRoaXMucGFja2FnZWRSb290Rm9sZGVyID0gZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnJvb3RGb2xkZXIsIFwicGFja2FnZWRcIik7XG4gICAgICAgIHRoaXMud3d3ID0ge1xuICAgICAgICAgICAgc3JjRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJzcmNcIiksXG4gICAgICAgICAgICBkaXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJkaXN0XCIpLFxuICAgICAgICAgICAgY3NzU3JjRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJjc3NTcmNcIiksXG4gICAgICAgICAgICBjc3NEaXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJjc3NcIiksXG4gICAgICAgICAgICBlMmVUZXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L2UyZVwiKSxcbiAgICAgICAgICAgIGUyZVRlc3RTcmNGb2xkZXI6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvZTJlL3NyY1wiKSxcbiAgICAgICAgICAgIGUyZVRlc3REaXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L2UyZS9kaXN0XCIpLFxuICAgICAgICAgICAgdW5pdFRlc3RGb2xkZXI6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvdW5pdFwiKSxcbiAgICAgICAgICAgIHVuaXRUZXN0U3JjRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L3VuaXQvc3JjXCIpLFxuICAgICAgICAgICAgdW5pdFRlc3REaXN0Rm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJ0ZXN0L3VuaXQvZGlzdFwiKSxcbiAgICAgICAgICAgIHJlcG9ydHNGb2xkZXI6IGZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy53d3dSb290Rm9sZGVyLCBcInRlc3QvcmVwb3J0c1wiKSxcbiAgICAgICAgICAgIGFzc2V0c0ZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiYXNzZXRzXCIpLFxuICAgICAgICAgICAgYXNzZXRzU3JjRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJhc3NldHNTcmNcIiksXG4gICAgICAgICAgICBidWlsZEZvbGRlcjogZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLnd3d1Jvb3RGb2xkZXIsIFwiYnVpbGRcIiksXG4gICAgICAgICAgICBwYWNrYWdlRm9sZGVyOiBmaWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMud3d3Um9vdEZvbGRlciwgXCJub2RlX21vZHVsZXNcIilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdGlhbGlzZVBhY2thZ2VzKGNsaWVudFBhY2thZ2VzOiB7IFtpZDogc3RyaW5nXTogVW5pdGVDbGllbnRQYWNrYWdlIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlcyA9IGNsaWVudFBhY2thZ2VzO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b2dnbGVDbGllbnRQYWNrYWdlKG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbk1pbmlmaWVkOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdGluZ0FkZGl0aW9uczogIHsgW2lkOiBzdHJpbmddOiBzdHJpbmd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZU1vZGU6IEluY2x1ZGVNb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdEluY2x1ZGVNb2RlOiBTY3JpcHRJbmNsdWRlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhY2thZ2U6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRzOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXJzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc01vZHVsZUxvYWRlcjogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBjbGllbnRQYWNrYWdlID0gbmV3IFVuaXRlQ2xpZW50UGFja2FnZSgpO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmluY2x1ZGVNb2RlID0gaW5jbHVkZU1vZGU7XG4gICAgICAgIGNsaWVudFBhY2thZ2UucHJlbG9hZCA9IHByZWxvYWQ7XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbiA9IG1haW47XG4gICAgICAgIGNsaWVudFBhY2thZ2UubWFpbk1pbmlmaWVkID0gbWFpbk1pbmlmaWVkO1xuICAgICAgICBjbGllbnRQYWNrYWdlLnRlc3RpbmdBZGRpdGlvbnMgPSB0ZXN0aW5nQWRkaXRpb25zO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmlzUGFja2FnZSA9IGlzUGFja2FnZTtcbiAgICAgICAgY2xpZW50UGFja2FnZS52ZXJzaW9uID0gdGhpcy5maW5kRGVwZW5kZW5jeVZlcnNpb24obmFtZSk7XG4gICAgICAgIGNsaWVudFBhY2thZ2UuYXNzZXRzID0gYXNzZXRzO1xuICAgICAgICBjbGllbnRQYWNrYWdlLm1hcCA9IG1hcDtcbiAgICAgICAgY2xpZW50UGFja2FnZS5sb2FkZXJzID0gbG9hZGVycztcbiAgICAgICAgY2xpZW50UGFja2FnZS5zY3JpcHRJbmNsdWRlTW9kZSA9IHNjcmlwdEluY2x1ZGVNb2RlO1xuICAgICAgICBjbGllbnRQYWNrYWdlLmlzTW9kdWxlTG9hZGVyID0gaXNNb2R1bGVMb2FkZXI7XG5cbiAgICAgICAgbGV0IG9wQXJyOiB7IFtpZDogc3RyaW5nXTogVW5pdGVDbGllbnRQYWNrYWdlIH07XG4gICAgICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgICAgICAgb3BBcnIgPSB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBcnIgPSB0aGlzLl9yZW1vdmVkQ2xpZW50UGFja2FnZXM7XG4gICAgICAgIH1cblxuICAgICAgICBvcEFycltuYW1lXSA9IGNsaWVudFBhY2thZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZURldkRlcGVuZGVuY3koZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSwgcmVxdWlyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgbGV0IG9wQXJyOiBzdHJpbmdbXTtcbiAgICAgICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICAgICAgICBvcEFyciA9IHRoaXMuX3JlcXVpcmVkRGV2RGVwZW5kZW5jaWVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BBcnIgPSB0aGlzLl9yZW1vdmVkRGV2RGVwZW5kZW5jaWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goZGVwID0+IHtcbiAgICAgICAgICAgIGlmIChvcEFyci5pbmRleE9mKGRlcCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgb3BBcnIucHVzaChkZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYnVpbGREZXBlbmRlbmNpZXModW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5fcmVtb3ZlZENsaWVudFBhY2thZ2VzKSB7XG4gICAgICAgICAgICBpZiAocGFja2FnZUpzb25EZXBlbmRlbmNpZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBwYWNrYWdlSnNvbkRlcGVuZGVuY2llc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWRkZWRUZXN0RGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgIGNvbnN0IHJlbW92ZWRUZXN0RGVwZW5kZW5jaWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcGtnIGluIHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXMpIHtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5jbGllbnRQYWNrYWdlc1twa2ddID0gdGhpcy5fcmVxdWlyZWRDbGllbnRQYWNrYWdlc1twa2ddO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNbcGtnXS5pbmNsdWRlTW9kZSA9PT0gXCJhcHBcIiB8fCB0aGlzLl9yZXF1aXJlZENsaWVudFBhY2thZ2VzW3BrZ10uaW5jbHVkZU1vZGUgPT09IFwiYm90aFwiKSB7XG4gICAgICAgICAgICAgICAgcGFja2FnZUpzb25EZXBlbmRlbmNpZXNbcGtnXSA9IHRoaXMuX3JlcXVpcmVkQ2xpZW50UGFja2FnZXNbcGtnXS52ZXJzaW9uO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fcmVxdWlyZWREZXZEZXBlbmRlbmNpZXMuaW5kZXhPZihwa2cpO1xuICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXF1aXJlZERldkRlcGVuZGVuY2llcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZFRlc3REZXBlbmRlbmNpZXMucHVzaChwa2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWRkZWRUZXN0RGVwZW5kZW5jaWVzLnB1c2gocGtnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvZ2dsZURldkRlcGVuZGVuY3koYWRkZWRUZXN0RGVwZW5kZW5jaWVzLCB0cnVlKTtcbiAgICAgICAgdGhpcy50b2dnbGVEZXZEZXBlbmRlbmN5KHJlbW92ZWRUZXN0RGVwZW5kZW5jaWVzLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGJ1aWxkRGV2RGVwZW5kZW5jaWVzKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlZERldkRlcGVuZGVuY2llcy5mb3JFYWNoKGRlcGVuZGVuY3kgPT4ge1xuICAgICAgICAgICAgaWYgKHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHBhY2thZ2VKc29uRGV2RGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9yZXF1aXJlZERldkRlcGVuZGVuY2llcy5mb3JFYWNoKHJlcXVpcmVkRGVwZW5kZW5jeSA9PiB7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbkRldkRlcGVuZGVuY2llc1tyZXF1aXJlZERlcGVuZGVuY3ldID0gdGhpcy5maW5kRGVwZW5kZW5jeVZlcnNpb24ocmVxdWlyZWREZXBlbmRlbmN5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmREZXBlbmRlbmN5VmVyc2lvbihyZXF1aXJlZERlcGVuZGVuY3k6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmVuZ2luZVBhY2thZ2VKc29uICYmIHRoaXMuZW5naW5lUGFja2FnZUpzb24ucGVlckRlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW5naW5lUGFja2FnZUpzb24ucGVlckRlcGVuZGVuY2llc1tyZXF1aXJlZERlcGVuZGVuY3ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5naW5lUGFja2FnZUpzb24ucGVlckRlcGVuZGVuY2llc1tyZXF1aXJlZERlcGVuZGVuY3ldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgRGVwZW5kZW5jeSAnJHtyZXF1aXJlZERlcGVuZGVuY3l9J2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGVwZW5kZW5jeSBWZXJzaW9ucyBtaXNzaW5nXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
