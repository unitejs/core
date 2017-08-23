/**
 * Tests for Engine.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { Engine } from "../../../../dist/engine/engine";
import { PackageUtils } from "../../../../dist/packageManagers/packageUtils";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("Engine", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: any;
    let uniteJsonWritten: UniteConfiguration;
    let packageJsonErrors: boolean;
    let spdxErrors: boolean;
    let fileWriteJsonErrors: boolean;
    let packageInfo: string;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

        uniteJson = undefined;
        packageJsonErrors = false;
        spdxErrors = false;
        fileWriteJsonErrors = false;
        packageInfo = undefined;
        uniteJsonWritten = undefined;

        const originalFileExists = fileSystemStub.fileExists;
        const stubExists = sandbox.stub(fileSystemStub, "fileExists");
        stubExists.callsFake(async (folder, filename) => {
            if (filename === "unite.json") {
                return Promise.resolve(uniteJson === undefined ? false : true);
            } else {
                return originalFileExists(folder, filename);
            }
        });
        const originalFileReadJson = fileSystemStub.fileReadJson;
        const stubreadJson = sandbox.stub(fileSystemStub, "fileReadJson");
        stubreadJson.callsFake(async (folder, filename) => {
            if (filename === "package.json") {
                return packageJsonErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            } else if (filename === "spdx-full.json") {
                return spdxErrors ? Promise.reject("Does not exist") : originalFileReadJson(folder, filename);
            } else if (filename === "unite.json") {
                return uniteJson === null ? Promise.reject("err") : Promise.resolve(uniteJson);
            } else {
                return originalFileReadJson(folder, filename);
            }
        });
        const originalFileWriteJson = fileSystemStub.fileWriteJson;
        const stubWriteJson = sandbox.stub(fileSystemStub, "fileWriteJson");
        stubWriteJson.callsFake(async (folder, filename, obj) => {
            if (fileWriteJsonErrors) {
                return Promise.reject("error");

            } else {
                if (filename === "unite.json") {
                    uniteJsonWritten = obj;
                    return Promise.resolve();
                } else {
                    return originalFileWriteJson(folder, filename, obj);
                }
            }
        });

        const execStub = sandbox.stub(PackageUtils, "exec");
        execStub.callsFake(async (folder, filename, obj) => {
            if (packageInfo === null) {
                return Promise.reject("package information");
            } else {
                return Promise.resolve(packageInfo);
            }
        });

        uniteJson = {
            packageName: "my-package",
            title: "My App",
            license: "MIT",
            sourceLanguage: "JavaScript",
            moduleType: "AMD",
            bundler: "RequireJS",
            unitTestRunner: "Karma",
            unitTestFramework: "Jasmine",
            e2eTestRunner: "Protractor",
            e2eTestFramework: "Mocha-Chai",
            cssPre: "Sass",
            cssPost: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "PlainApp"
        };
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    it("can be created", async () => {
        const obj = new Engine(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });

    describe("configure", () => {
        it("can fail when calling with undefined packageName", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with undefined title", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("title");
        });

        it("can fail when calling with missing spdx-full.json", async () => {
            spdxErrors = true;
            uniteJson = undefined;

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("spdx-full.json");
        });

        it("can fail when calling with undefined license", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("license");
        });

        it("can fail when calling with undefined sourceLanguage", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("sourceLanguage");
        });

        it("can fail when calling with undefined moduleType", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("moduleType");
        });

        it("can fail when calling with undefined bundler", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("bundler");
        });

        it("can fail when calling with undefined unitTestRunner", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestRunner");
        });

        it("can fail when calling with unitTestRunner None and unitTestFramework", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "None", "Jasmine",
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        });

        it("can fail when calling with unitTestRunner Karma and missing unitTestFramework", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("unitTestFramework");
        });

        it("can fail when calling with undefined e2eTestRunner", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestRunner");
        });

        it("can fail when calling with e2eTestRunner None and e2eTestFramework", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "None", "Mocha-Chai", undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("is not valid");
        });

        it("can fail when calling with e2eTestRunner Protractor and missing e2eTestFramework", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("e2eTestFramework");
        });

        it("can fail when calling with undefined linter", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "None", undefined,
                                            "None", undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("linter");
        });

        it("can fail when calling with undefined cssPre", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPre");
        });

        it("can fail when calling with undefined cssPost", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("cssPost");
        });

        it("can fail when calling with invalid packageManager", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", "None", <any>"blah", undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail when calling with undefined applicationFramework", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", "None", "Npm", undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("applicationFramework");
        });

        it("can fail when missing package dependencies", async () => {
            uniteJson = undefined;
            packageJsonErrors = true;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", "None", "Npm", "PlainApp", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies failed");
        });

        it("can fail when pipeline step fails", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "TSLint", "Sass", "None", "Npm", "PlainApp", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("TSLint");
        });

        it("can succeed when calling with undefined outputDirectory", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", "None", "Npm", "PlainApp", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed when calling with defined outputDirectory", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure("my-package", "My App", "MIT", "JavaScript", "AMD", "RequireJS", "Karma", "Jasmine",
                                            "Protractor", "Mocha-Chai", "ESLint", "Sass", "None", "Npm", "PlainApp", "./test/unit/temp");
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can succeed with existing unite.json", async () => {
            uniteJson.buildConfigurations = { dev: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerWarningSpy.args[0][0]).to.contain("should probably");
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });

        it("can fail with invalid unite.json", async () => {
            uniteJson = null;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.configure(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                                            undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("existing unite.json");
        });
    });

    describe("clientPackage add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage(undefined, undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage(undefined, undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined packageName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with undefined packageManager", async () => {
            uniteJson.packageManager = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail if invalid includeMode", async () => {
            uniteJson.clientPackages = { moment: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, <any>"foo", undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("includeMode");
        });

        it("can fail if package already exists", async () => {
            uniteJson.clientPackages = { moment: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("already");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if packageManager gets info errors", async () => {
            packageInfo = null;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Package Information");
        });

        it("can fail if pipeline step fails", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            fileWriteJsonErrors = true;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                "mainMinified.js", undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed with no packageManager info", async () => {
            packageInfo = "{}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^0.0.1");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        });

        it("can succeed with packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, "app", undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        });

        it("can succeed with override version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", "4.5.6", undefined, "app", undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        });

        it("can succeed with override main packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, "test", false, "main.js",
                                                undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        });

        it("can succeed with override main and version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", "4.5.6", undefined, "test", false, "main.js",
                                                undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        });

        it("can succeed with override mainMinified and version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", undefined, undefined, undefined, undefined, undefined,
                                                "mainMinified.js", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("mainMinified.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        });

        it("can succeed with all parameters", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("add", "moment", "7.8.9", true, "both", false, "1.js",
                                                "2.js", false, "**/*.css", undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.moment.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.moment.testScriptInclude).to.be.equal(false);
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.isPackage).to.be.equal(false);
            Chai.expect(uniteJsonWritten.clientPackages.moment.assets).to.be.equal("**/*.css");
        });
    });

    describe("clientPackage remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage(undefined, undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage(undefined, undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined packageName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", undefined, undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with undefined packageManager", async () => {
            uniteJson.packageManager = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail if package does not exist", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not been");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;
            uniteJson.clientPackages = { moment: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.clientPackages = { moment: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed if all ok", async () => {
            uniteJson.clientPackages = { moment: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.clientPackage("remove", "moment", undefined, undefined, undefined, undefined,
                                                undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });
    });

    describe("buildConfiguration add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration(undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration(undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("add", undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("add", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("add", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed when calling with configurationName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("add", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(true);
        });

        it("can succeed when calling all params", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("add", "myconfig", true, true, false, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(false);
        });
    });

    describe("buildConfiguration remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration(undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration(undefined, undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", undefined, undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;
            uniteJson.buildConfigurations = { myconfig: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.buildConfigurations = { myconfig: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can fail when configurationName does not exist", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("has not");
        });

        it("can succeed when calling with configurationName", async () => {
            uniteJson.buildConfigurations = { myconfig: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", "myconfig", undefined, undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });

        it("can succeed when calling all params", async () => {
            uniteJson.buildConfigurations = { myconfig: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.buildConfiguration("remove", "myconfig", true, true, false, undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });
    });

    describe("platform add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform(undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform(undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined platformName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("add", undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("platformName");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("add", "Web", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("add", "Web", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed when calling with platformName Web", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("add", "Web", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.Web).not.to.be.equal(undefined);
        });

        it("can succeed when calling with platformName Electron", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("add", "Electron", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.Electron).not.to.be.equal(undefined);
        });
    });

    describe("platform remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform(undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform(undefined, undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined platformName", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", undefined, undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("platformName");
        });

        it("can fail if package.json error", async () => {
            packageJsonErrors = true;
            uniteJson.platforms = { Web: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Web", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("dependencies");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.platforms = { Web: {} };

            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Web", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can fail when platformName does not exist", async () => {
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Web", undefined);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("has not");
        });

        it("can succeed when calling with platformName Web", async () => {
            uniteJson.platforms = { Web: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Web", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        });

        it("can succeed when calling with platformName Electron", async () => {
            uniteJson.platforms = { Electron: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Electron", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        });

        it("can succeed when calling all params", async () => {
            uniteJson.platforms = { Web: {} };
            const obj = new Engine(loggerStub, fileSystemStub);
            const res = await obj.platform("remove", "Web", undefined);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.platforms.myconfig).to.be.equal(undefined);
        });
    });
});