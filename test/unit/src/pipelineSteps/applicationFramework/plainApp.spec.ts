/**
 * Tests for PlainApp.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { PlainApp } from "../../../../../dist/pipelineSteps/applicationFramework/plainApp";
import { ProtractorConfiguration } from "../../../../../src/configuration/models/protractor/protractorConfiguration";
import { FileSystemMock } from "../../fileSystem.mock";

describe("PlainApp", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerInfoSpy: Sinon.SinonSpy;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerInfoSpy = sandbox.spy(loggerStub, "info");
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.applicationFramework = "PlainApp";
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
        uniteConfigurationStub.viewExtensions = [];
        uniteConfigurationStub.styleExtension = "css";
        uniteConfigurationStub.notBundledLoader = "rjs";
        uniteConfigurationStub.bundledLoader = "rjs";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
        engineVariablesStub.setConfiguration("Protractor", { plugins: []});
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new PlainApp();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new PlainApp();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(4);
        });
    });

    describe("initialise", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new PlainApp();
            uniteConfigurationStub.applicationFramework = "Aurelia";
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });

        it("can be called with application framework matching", async () => {
            const obj = new PlainApp();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(uniteConfigurationStub.viewExtensions.length).to.be.equal(1);
        });
    });

    describe("process", () => {
        it("can be called with application framework not matching", async () => {
            const obj = new PlainApp();
            uniteConfigurationStub.applicationFramework = "Aurelia";
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);
        });

        it("can be called with application framework matching javascript", async () => {
            const obj = new PlainApp();
            engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.push({ path: "aaa" });
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with application framework matching typescript", async () => {
            uniteConfigurationStub.sourceLanguage = "TypeScript";
            uniteConfigurationStub.sourceExtensions = ["ts"];
            const obj = new PlainApp();
            engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.push({ path: "aaa" });
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor").plugins.length).to.be.equal(2);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins")).to.be.equal(undefined);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.ts");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can be called with application framework matching webdriverio", async () => {
            engineVariablesStub.setConfiguration("Protractor", undefined);
            engineVariablesStub.setConfiguration("WebdriverIO.Plugins", []);
            const obj = new PlainApp();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<ProtractorConfiguration>("Protractor")).to.be.equal(undefined);
            Chai.expect(engineVariablesStub.getConfiguration<string[]>("WebdriverIO.Plugins").length).to.be.equal(1);
        });

        it("can fail with no source", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new PlainApp();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            const exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no e2e tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new PlainApp();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/src/", "app.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });

        it("can fail with no unit tests", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileReadBinary");
            stub.callsFake(async (directoryName, fileName) => {
                if (fileName.endsWith("spec.js")
                    && directoryName.indexOf("unit") >= 0) {
                    return Promise.reject("error");
                } else {
                    return new FileSystemMock().fileReadBinary(directoryName, fileName);
                }
            });

            const obj = new PlainApp();
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/e2e/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/test/unit/src/", "app.spec.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
