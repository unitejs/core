/**
 * Tests for Build Configuration Command.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { BuildConfigurationCommand } from "../../../../src/commands/buildConfigurationCommand";
import { UniteBuildConfiguration } from "../../../../src/configuration/models/unite/uniteBuildConfiguration";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { FileSystemMock } from "../fileSystem.mock";
import { ReadOnlyFileSystemMock } from "../readOnlyFileSystem.mock";

describe("BuildConfigurationCommand", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let loggerErrorSpy: Sinon.SinonSpy;
    let loggerBannerSpy: Sinon.SinonSpy;
    let uniteJson: UniteConfiguration;
    let uniteJsonWritten: UniteConfiguration;
    let fileWriteJsonErrors: boolean;
    let enginePeerPackages: { [id: string]: string};

    beforeEach(async () => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.banner = () => { };
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerStub.warning = () => { };

        fileSystemStub = new ReadOnlyFileSystemMock();

        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        loggerBannerSpy = sandbox.spy(loggerStub, "banner");

        uniteJson = undefined;
        uniteJsonWritten = undefined;
        fileWriteJsonErrors = false;

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
            cssLinter: "None",
            documenter: "None",
            linter: "ESLint",
            packageManager: "Yarn",
            taskManager: "Gulp",
            server: "BrowserSync",
            applicationFramework: "Vanilla",
            ides: [],
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

        enginePeerPackages = await fileSystemStub.fileReadJson<{ [id: string ]: string}>(
            fileSystemStub.pathCombine(__dirname, "../../../../node_modules/unitejs-packages/assets/"), "peerPackages.json");
    });

    afterEach(async () => {
        sandbox.restore();
        const obj = new FileSystemMock();
        await obj.directoryDelete("./test/unit/temp");
    });

    describe("buildConfiguration add", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "add",
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;

            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can succeed when calling with configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.pwa).to.be.equal(false);
        });

        it("can succeed when calling all params", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "add",
                configurationName: "myconfig",
                bundle: true,
                minify: true,
                sourcemaps: false,
                pwa: true,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.bundle).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.minify).to.be.equal(true);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.sourcemaps).to.be.equal(false);
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig.pwa).to.be.equal(true);
        });
    });

    describe("buildConfiguration remove", () => {
        it("can fail when calling with no unite.json", async () => {
            uniteJson = undefined;
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("no unite.json");
        });

        it("can fail when calling with undefined operation", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: undefined,
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("operation");
        });

        it("can fail when calling with undefined configurationName", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "remove",
                configurationName: undefined,
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("configurationName");
        });

        it("can fail if pipeline step fails", async () => {
            fileWriteJsonErrors = true;
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };

            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("failed");
        });

        it("can fail when configurationName does not exist", async () => {
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contain("has not");
        });

        it("can succeed when calling with configurationName", async () => {
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });

        it("can succeed when calling all params", async () => {
            uniteJson.buildConfigurations = { myconfig: new UniteBuildConfiguration() };
            const obj = new BuildConfigurationCommand();
            obj.create(loggerStub, fileSystemStub, fileSystemStub.pathCombine(__dirname, "../../../../"), "0.0.1", enginePeerPackages);
            const res = await obj.run({
                operation: "remove",
                configurationName: "myconfig",
                bundle: undefined,
                minify: undefined,
                sourcemaps: undefined,
                pwa: undefined,
                outputDirectory: undefined
            });
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerBannerSpy.args[0][0]).to.contain("Success");
            Chai.expect(uniteJsonWritten.buildConfigurations.myconfig).to.be.equal(undefined);
        });
    });
});
