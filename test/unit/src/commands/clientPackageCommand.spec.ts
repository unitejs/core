/**
 * Tests for Build Configuration Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { ClientPackageCommand } from "../../../../dist/commands/clientPackageCommand";
import { PackageConfiguration } from "../../../../dist/configuration/models/packages/packageConfiguration";
import { UniteClientPackage } from "../../../../dist/configuration/models/unite/uniteClientPackage";
import { UniteConfiguration } from "../../../../dist/configuration/models/unite/uniteConfiguration";
import { PackageUtils } from "../../../../dist/pipelineSteps/packageUtils";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("ClientPackageCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerWarningSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let uniteJsonWritten: UniteConfiguration;
    let packageJsonErrors: boolean;
    let spdxErrors: boolean;
    let fileWriteJsonErrors: boolean;
    let packageInfo: string;
    let failPackageAdd: boolean;
    let enginePackageConfiguration: PackageConfiguration;

    beforeEach(async () => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerWarningSpy = sandbox.spy(loggerStub, "warning");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

        uniteJson = undefined;
        packageJsonErrors = false;
        spdxErrors = false;
        fileWriteJsonErrors = false;
        packageInfo = undefined;
        uniteJsonWritten = undefined;
        failPackageAdd = false;

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
            if (filename === "unite.json") {
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
        execStub.callsFake(async (logger: ILogger, fileSystem: IFileSystem, packageName: string, workingDirectory: string, args: string[]) => {
            if (args[0] === "view") {
                if (packageInfo === null) {
                    return Promise.reject("package information");
                } else {
                    return Promise.resolve(packageInfo);
                }
            } else {
                return failPackageAdd ? Promise.reject("error") : Promise.resolve();
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
            unitTestEngine: "PhantomJS",
            e2eTestRunner: "Protractor",
            e2eTestFramework: "MochaChai",
            cssPre: "Sass",
            cssPost: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "PlainApp",
            ide: "",
            uniteVersion: "0.0.0",
            sourceExtensions: [],
            viewExtensions: [],
            styleExtension: "",
            clientPackages: undefined,
            dirs: undefined,
            srcDistReplace: undefined,
            srcDistReplaceWith: undefined,
            buildConfigurations: undefined,
            platforms: undefined
        };

        enginePackageConfiguration = await fileSystemStub.fileReadJson<PackageConfiguration>(fileSystemStub.pathCombine(__dirname, "../../../../"), "package.json");
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    describe("clientPackage add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined packageName", async () => {
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with undefined packageManager", async () => {
            uniteJson.packageManager = undefined;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail if invalid includeMode", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: <any>"foo",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("includeMode");
        });

        it("can fail if invalid scriptIncludeMode", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: <any>"foo",
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("scriptIncludeMode");
        });

        it("can fail if main and noScript", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("main and noScript");
        });

        it("can fail if mainMinified and noScript", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("mainMinified and noScript");
        });

        it("can fail if package already exists", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("already");
        });

        it("can fail if packageManager gets info errors", async () => {
            packageInfo = null;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("Package Information");
        });

        it("can fail if pipeline step fails", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            fileWriteJsonErrors = true;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can fail with badly formed testAdditions", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: "sdfgsd",
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failure");
        });

        it("can fail when package add fails", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            failPackageAdd = true;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed with just profile", async () => {
            packageInfo = JSON.stringify({ version: "1.2.3" });
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: "bluebird",
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.main).to.be.equal("/js/browser/bluebird.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.mainMinified).to.be.equal("/js/browser/bluebird.min.js");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.bluebird.scriptIncludeMode).to.be.equal("both");
        });

        it("can succeed with no packageManager info", async () => {
            packageInfo = "{}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^0.0.1");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        });

        it("can succeed with noScript", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "app",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: true,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal(undefined);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        });

        it("can succeed with packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "app",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        });

        it("can succeed with override version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: "4.5.6",
                preload: undefined,
                includeMode: "app",
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("app");
        });

        it("can succeed with override main packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        });

        it("can succeed with override main and version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: "4.5.6",
                preload: undefined,
                includeMode: "test",
                scriptIncludeMode: "none",
                main: "main.js",
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("4.5.6");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("main.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("test");
        });

        it("can succeed with override mainMinified and version packageManager info", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: "mainMinified.js",
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("^1.2.3");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("index.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("mainMinified.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
        });

        it("can succeed with all parameters", async () => {
            packageInfo = "{ \"version\": \"1.2.3\", \"main\": \"index.js\"}";
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "add",
                packageName: "moment",
                version: "7.8.9",
                preload: true,
                includeMode: "both",
                scriptIncludeMode: "none",
                main: "1.js",
                mainMinified: "2.js",
                testingAdditions: "my-pkg=blah;my-pkg3=foo",
                isPackage: true,
                assets: "**/*.css",
                map: "a=b;c=d",
                loaders: "text=*.html;css=*.css",
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.clientPackages.moment.version).to.be.equal("7.8.9");
            Chai.expect(uniteJsonWritten.clientPackages.moment.preload).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.includeMode).to.be.equal("both");
            Chai.expect(uniteJsonWritten.clientPackages.moment.main).to.be.equal("1.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.mainMinified).to.be.equal("2.js");
            Chai.expect(uniteJsonWritten.clientPackages.moment.scriptIncludeMode).to.be.equal("none");
            Chai.expect(uniteJsonWritten.clientPackages.moment.testingAdditions).to.be.deep.equal({ "my-pkg": "blah", "my-pkg3": "foo" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.isPackage).to.be.equal(true);
            Chai.expect(uniteJsonWritten.clientPackages.moment.assets).to.be.equal("**/*.css");
            Chai.expect(uniteJsonWritten.clientPackages.moment.map).to.be.deep.equal({ a: "b", c: "d" });
            Chai.expect(uniteJsonWritten.clientPackages.moment.loaders).to.be.deep.equal({ text: "*.html", css: "*.css" });
        });
    });

    describe("clientPackage remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: undefined,
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined packageName", async () => {
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                packageName: undefined,
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageName");
        });

        it("can fail when calling with undefined packageManager", async () => {
            uniteJson.packageManager = undefined;
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("packageManager");
        });

        it("can fail if package does not exist", async () => {
            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("not been");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.clientPackages = { moment: new UniteClientPackage() };

            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed if all ok", async () => {
            uniteJson.clientPackages = { moment: new UniteClientPackage() };

            const obj = new ClientPackageCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), enginePackageConfiguration);
            const res = await obj.run({
                operation: "remove",
                packageName: "moment",
                version: undefined,
                preload: undefined,
                includeMode: undefined,
                scriptIncludeMode: undefined,
                main: undefined,
                mainMinified: undefined,
                testingAdditions: undefined,
                isPackage: undefined,
                assets: undefined,
                map: undefined,
                loaders: undefined,
                noScript: undefined,
                profile: undefined,
                packageManager: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
        });
    });
});