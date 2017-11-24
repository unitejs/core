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
 * Tests for SharedAppFramework.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const sharedAppFramework_1 = require("../../../../dist/pipelineSteps/sharedAppFramework");
const fileSystem_mock_1 = require("../fileSystem.mock");
class TestSharedAppFramework extends sharedAppFramework_1.SharedAppFramework {
    constructor() {
        super();
        this.customUnitTests = false;
        this.appModuleName = "app";
        this.htmlFiles = ["app.html"];
        this.appCssFiles = ["child/child"];
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.js`], false);
            if (ret === 0) {
                ret = yield this.generateAppSource(logger, fileSystem, uniteConfiguration, engineVariables, [`entryPoint.js`], true);
            }
            if (ret === 0) {
                ret = yield _super("generateAppHtml").call(this, logger, fileSystem, uniteConfiguration, engineVariables, this.htmlFiles);
            }
            if (ret === 0) {
                ret = yield _super("generateAppCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables, this.appCssFiles);
            }
            if (ret === 0) {
                ret = yield _super("generateE2eTest").call(this, logger, fileSystem, uniteConfiguration, engineVariables, ["app.spec.js"], true);
            }
            if (ret === 0) {
                ret = yield this.generateUnitTest(logger, fileSystem, uniteConfiguration, engineVariables, [`${this.appModuleName}.spec.js`], !this.customUnitTests);
            }
            if (ret === 0) {
                ret = yield _super("generateCss").call(this, logger, fileSystem, uniteConfiguration, engineVariables);
            }
            return ret;
        });
    }
}
describe("SharedAppFramework", () => {
    let sandbox;
    let loggerStub;
    let fileSystemMock;
    let uniteConfigurationStub;
    let engineVariablesStub;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        fileSystemMock = new fileSystem_mock_1.FileSystemMock();
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "Aurelia";
        uniteConfigurationStub.moduleType = "AMD";
        uniteConfigurationStub.bundler = "RequireJS";
        uniteConfigurationStub.unitTestRunner = "Karma";
        uniteConfigurationStub.unitTestFramework = "Jasmine";
        uniteConfigurationStub.e2eTestRunner = "Protractor";
        uniteConfigurationStub.e2eTestFramework = "Jasmine";
        uniteConfigurationStub.sourceLanguage = "JavaScript";
        uniteConfigurationStub.linter = "ESLint";
        uniteConfigurationStub.cssPre = "Css";
        uniteConfigurationStub.cssPost = "None";
        uniteConfigurationStub.clientPackages = {};
        uniteConfigurationStub.sourceExtensions = ["js"];
        uniteConfigurationStub.styleExtension = "css";
        engineVariablesStub = new engineVariables_1.EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
        yield fileSystemMock.directoryDelete("./test/unit/temp");
    }));
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new TestSharedAppFramework();
        Chai.should().exist(obj);
    }));
    describe("finalise", () => {
        it("can fail with no source", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no html", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("html")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no app css", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("css")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.html");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no e2e tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/child/", "child.css");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no unit tests", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can fail with no css", () => __awaiter(this, void 0, void 0, function* () {
            const stub = sandbox.stub(fileSystemMock, "fileReadText");
            stub.callsFake((directoryName, fileName) => __awaiter(this, void 0, void 0, function* () {
                if (fileName.indexOf("reset") >= 0) {
                    return Promise.reject("error");
                }
                else {
                    return new fileSystem_mock_1.FileSystemMock().fileReadText(directoryName, fileName);
                }
            }));
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            let exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = yield fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with no unit test runner", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.unitTestRunner = "None";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with no e2e test runner", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            uniteConfigurationStub.e2eTestRunner = "None";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        }));
        it("can succeed with custom unit tests", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            obj.appModuleName = "app.module";
            obj.htmlFiles = [];
            obj.appCssFiles = [];
            obj.customUnitTests = true;
            uniteConfigurationStub.applicationFramework = "Angular";
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.module.js");
            Chai.expect(exists).to.be.equal(true);
        }));
        it("can succeed", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new TestSharedAppFramework();
            const res = yield obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            const exists = yield fileSystemMock.fileExists("./test/unit/temp/www/cssSrc/", "reset.css");
            Chai.expect(exists).to.be.equal(true);
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvcGlwZWxpbmVTdGVwcy9zaGFyZWRBcHBGcmFtZXdvcmsuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRy9CLHNHQUFtRztBQUNuRyw0RUFBeUU7QUFDekUseUZBQXNGO0FBQ3RGLHdEQUFvRDtBQUVwRCw0QkFBNkIsU0FBUSx1Q0FBa0I7SUFNbkQ7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOzs7WUFDNUosSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXJJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pILENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixHQUFHLEdBQUcs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QU0sR0FBRyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztZQUN6QyxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvc2hhcmVkQXBwRnJhbWV3b3JrLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBTaGFyZWRBcHBGcmFtZXdvcmsuXG4gKi9cbmltcG9ydCAqIGFzIENoYWkgZnJvbSBcImNoYWlcIjtcbmltcG9ydCAqIGFzIFNpbm9uIGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9lbmdpbmUvZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBTaGFyZWRBcHBGcmFtZXdvcmsgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL3BpcGVsaW5lU3RlcHMvc2hhcmVkQXBwRnJhbWV3b3JrXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtTW9jayB9IGZyb20gXCIuLi9maWxlU3lzdGVtLm1vY2tcIjtcblxuY2xhc3MgVGVzdFNoYXJlZEFwcEZyYW1ld29yayBleHRlbmRzIFNoYXJlZEFwcEZyYW1ld29yayB7XG4gICAgcHVibGljIGN1c3RvbVVuaXRUZXN0czogYm9vbGVhbjtcbiAgICBwdWJsaWMgYXBwTW9kdWxlTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBodG1sRmlsZXM6IHN0cmluZ1tdO1xuICAgIHB1YmxpYyBhcHBDc3NGaWxlczogc3RyaW5nW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jdXN0b21Vbml0VGVzdHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hcHBNb2R1bGVOYW1lID0gXCJhcHBcIjtcbiAgICAgICAgdGhpcy5odG1sRmlsZXMgPSBbXCJhcHAuaHRtbFwiXTtcbiAgICAgICAgdGhpcy5hcHBDc3NGaWxlcyA9IFtcImNoaWxkL2NoaWxkXCJdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYCR7dGhpcy5hcHBNb2R1bGVOYW1lfS5qc2BdLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZUFwcFNvdXJjZShsb2dnZXIsIGZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBbYGVudHJ5UG9pbnQuanNgXSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUFwcEh0bWwobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdGhpcy5odG1sRmlsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgc3VwZXIuZ2VuZXJhdGVBcHBDc3MobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdGhpcy5hcHBDc3NGaWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5nZW5lcmF0ZUUyZVRlc3QobG9nZ2VyLCBmaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgW1wiYXBwLnNwZWMuanNcIl0sIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5nZW5lcmF0ZVVuaXRUZXN0KGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIFtgJHt0aGlzLmFwcE1vZHVsZU5hbWV9LnNwZWMuanNgXSwgIXRoaXMuY3VzdG9tVW5pdFRlc3RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXQgPT09IDApIHtcbiAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmdlbmVyYXRlQ3NzKGxvZ2dlciwgZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5cbmRlc2NyaWJlKFwiU2hhcmVkQXBwRnJhbWV3b3JrXCIsICgpID0+IHtcbiAgICBsZXQgc2FuZGJveDogU2lub24uU2lub25TYW5kYm94O1xuICAgIGxldCBsb2dnZXJTdHViOiBJTG9nZ2VyO1xuICAgIGxldCBmaWxlU3lzdGVtTW9jazogSUZpbGVTeXN0ZW07XG4gICAgbGV0IHVuaXRlQ29uZmlndXJhdGlvblN0dWI6IFVuaXRlQ29uZmlndXJhdGlvbjtcbiAgICBsZXQgZW5naW5lVmFyaWFibGVzU3R1YjogRW5naW5lVmFyaWFibGVzO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5zYW5kYm94LmNyZWF0ZSgpO1xuICAgICAgICBsb2dnZXJTdHViID0gPElMb2dnZXI+e307XG4gICAgICAgIGxvZ2dlclN0dWIuaW5mbyA9ICgpID0+IHsgfTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5lcnJvciA9ICgpID0+IHsgfTtcblxuICAgICAgICBmaWxlU3lzdGVtTW9jayA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViID0gbmV3IFVuaXRlQ29uZmlndXJhdGlvbigpO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmFwcGxpY2F0aW9uRnJhbWV3b3JrID0gXCJBdXJlbGlhXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIubW9kdWxlVHlwZSA9IFwiQU1EXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuYnVuZGxlciA9IFwiUmVxdWlyZUpTXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RSdW5uZXIgPSBcIkthcm1hXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RGcmFtZXdvcmsgPSBcIkphc21pbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lMmVUZXN0UnVubmVyID0gXCJQcm90cmFjdG9yXCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuZTJlVGVzdEZyYW1ld29yayA9IFwiSmFzbWluZVwiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnNvdXJjZUxhbmd1YWdlID0gXCJKYXZhU2NyaXB0XCI7XG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIubGludGVyID0gXCJFU0xpbnRcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jc3NQcmUgPSBcIkNzc1wiO1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmNzc1Bvc3QgPSBcIk5vbmVcIjtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5jbGllbnRQYWNrYWdlcyA9IHt9O1xuICAgICAgICB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLnNvdXJjZUV4dGVuc2lvbnMgPSBbXCJqc1wiXTtcbiAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5zdHlsZUV4dGVuc2lvbiA9IFwiY3NzXCI7XG5cbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1YiA9IG5ldyBFbmdpbmVWYXJpYWJsZXMoKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5lbmdpbmVBc3NldHNGb2xkZXIgPSBcIi4vYXNzZXRzL1wiO1xuICAgICAgICBlbmdpbmVWYXJpYWJsZXNTdHViLnNldHVwRGlyZWN0b3JpZXMoZmlsZVN5c3RlbU1vY2ssIFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICAgICAgZW5naW5lVmFyaWFibGVzU3R1Yi5maW5kRGVwZW5kZW5jeVZlcnNpb24gPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKFwiMS4yLjNcIik7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICAgICAgYXdhaXQgZmlsZVN5c3RlbU1vY2suZGlyZWN0b3J5RGVsZXRlKFwiLi90ZXN0L3VuaXQvdGVtcFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgYXN5bmMoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmluYWxpc2VcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8gc291cmNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRUZXh0XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKFwianNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtTW9jaygpLmZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBodG1sXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRUZXh0XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKFwiaHRtbFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZpbGVTeXN0ZW1Nb2NrKCkuZmlsZVJlYWRUZXh0KGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICAgICAgbGV0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmpzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvXCIsIFwiYXBwLmh0bWxcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGFwcCBjc3NcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlUmVhZFRleHRcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJjc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtTW9jaygpLmZpbGVSZWFkVGV4dChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIGxldCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvc3JjL1wiLCBcImFwcC5odG1sXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9zcmMvY2hpbGQvXCIsIFwiY2hpbGQuY3NzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBlMmUgdGVzdHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R1YiA9IHNhbmRib3guc3R1YihmaWxlU3lzdGVtTW9jaywgXCJmaWxlUmVhZFRleHRcIik7XG4gICAgICAgICAgICBzdHViLmNhbGxzRmFrZShhc3luYyAoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZU5hbWUuZW5kc1dpdGgoXCJzcGVjLmpzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3NyYy9jaGlsZC9cIiwgXCJjaGlsZC5jc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3Rlc3QvZTJlL3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8gdW5pdCB0ZXN0c1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHViID0gc2FuZGJveC5zdHViKGZpbGVTeXN0ZW1Nb2NrLCBcImZpbGVSZWFkVGV4dFwiKTtcbiAgICAgICAgICAgIHN0dWIuY2FsbHNGYWtlKGFzeW5jIChkaXJlY3RvcnlOYW1lLCBmaWxlTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5lbmRzV2l0aChcInNwZWMuanNcIilcbiAgICAgICAgICAgICAgICAgICAgJiYgZGlyZWN0b3J5TmFtZS5pbmRleE9mKFwidW5pdFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3Rlc3QvZTJlL3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvdGVzdC91bml0L3NyYy9cIiwgXCJhcHAuc3BlYy5qc1wiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGV4aXN0cykudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHdpdGggbm8gY3NzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN0dWIgPSBzYW5kYm94LnN0dWIoZmlsZVN5c3RlbU1vY2ssIFwiZmlsZVJlYWRUZXh0XCIpO1xuICAgICAgICAgICAgc3R1Yi5jYWxsc0Zha2UoYXN5bmMgKGRpcmVjdG9yeU5hbWUsIGZpbGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lLmluZGV4T2YoXCJyZXNldFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmlsZVN5c3RlbU1vY2soKS5maWxlUmVhZFRleHQoZGlyZWN0b3J5TmFtZSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgICAgICBsZXQgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3Rlc3QvdW5pdC9zcmMvXCIsIFwiYXBwLnNwZWMuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L2Nzc1NyYy9cIiwgXCJyZXNldC5jc3NcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vIHVuaXQgdGVzdCBydW5uZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFRlc3RTaGFyZWRBcHBGcmFtZXdvcmsoKTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIudW5pdFRlc3RSdW5uZXIgPSBcIk5vbmVcIjtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IG9iai5maW5hbGlzZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtTW9jaywgdW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgZmlsZVN5c3RlbU1vY2suZmlsZUV4aXN0cyhcIi4vdGVzdC91bml0L3RlbXAvd3d3L3Rlc3QvdW5pdC9zcmMvXCIsIFwiYXBwLnNwZWMuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIG5vIGUyZSB0ZXN0IHJ1bm5lclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgVGVzdFNoYXJlZEFwcEZyYW1ld29yaygpO1xuICAgICAgICAgICAgdW5pdGVDb25maWd1cmF0aW9uU3R1Yi5lMmVUZXN0UnVubmVyID0gXCJOb25lXCI7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy90ZXN0L2UyZS9zcmMvXCIsIFwiYXBwLnNwZWMuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCB3aXRoIGN1c3RvbSB1bml0IHRlc3RzXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBvYmouYXBwTW9kdWxlTmFtZSA9IFwiYXBwLm1vZHVsZVwiO1xuICAgICAgICAgICAgb2JqLmh0bWxGaWxlcyA9IFtdO1xuICAgICAgICAgICAgb2JqLmFwcENzc0ZpbGVzID0gW107XG4gICAgICAgICAgICBvYmouY3VzdG9tVW5pdFRlc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIuYXBwbGljYXRpb25GcmFtZXdvcmsgPSBcIkFuZ3VsYXJcIjtcblxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgb2JqLmZpbmFsaXNlKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1Nb2NrLCB1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB0cnVlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCBmaWxlU3lzdGVtTW9jay5maWxlRXhpc3RzKFwiLi90ZXN0L3VuaXQvdGVtcC93d3cvc3JjL1wiLCBcImFwcC5tb2R1bGUuanNcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChleGlzdHMpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBUZXN0U2hhcmVkQXBwRnJhbWV3b3JrKCk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBvYmouZmluYWxpc2UobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbU1vY2ssIHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW1Nb2NrLmZpbGVFeGlzdHMoXCIuL3Rlc3QvdW5pdC90ZW1wL3d3dy9jc3NTcmMvXCIsIFwicmVzZXQuY3NzXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QoZXhpc3RzKS50by5iZS5lcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
