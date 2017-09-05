/**
 * Tests for Gulp.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../dist/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../dist/engine/engineVariables";
import { Gulp } from "../../../../../dist/pipelineSteps/taskManager/gulp";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Gulp", () => {
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
        uniteConfigurationStub.taskManager = "Gulp";

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.engineAssetsFolder = "./assets/";
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
        engineVariablesStub.findDependencyVersion = sandbox.stub().returns("1.2.3");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new Gulp();
        Chai.should().exist(obj);
    });

    describe("influences", () => {
        it("can be called and return influences", async () => {
            const obj = new Gulp();
            const res = obj.influences();
            Chai.expect(res.length).to.be.equal(2);
        });
    });

    describe("intitialise", () => {
        it("can succeed", async () => {
            const obj = new Gulp();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
        });
    });

    describe("process", () => {
        it("can be called with mismatched task manager and directory existing", async () => {
            sandbox.stub(fileSystemMock, "directoryExists").resolves(true);
            const stub = sandbox.stub(fileSystemMock, "directoryDelete").resolves();
            uniteConfigurationStub.taskManager = undefined;
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "Protractor";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(1);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal(undefined);
        });

        it("can be called with mismatched task manager and directory not existing", async () => {
            sandbox.stub(fileSystemMock, "directoryExists").resolves(false);
            uniteConfigurationStub.taskManager = undefined;
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "Protractor";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal(undefined);
        });

        it("can be called with mismatched task manager and directory existing throws exception", async () => {
            sandbox.stub(fileSystemMock, "directoryExists").rejects("error");
            sandbox.stub(fileSystemMock, "directoryDelete").resolves();
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "Protractor";
            uniteConfigurationStub.server = "BrowserSync";
            uniteConfigurationStub.taskManager = undefined;
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can be called and fail to copy file", async () => {
            sandbox.stub(fileSystemMock, "fileWriteBinary").rejects();
            sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "None";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(1);
        });

        it("can be called with no unit runner or e2e runner", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileWriteBinary").resolves();
            sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "None";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            Chai.expect(stub.callCount).to.be.equal(24);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal("1.2.3");
            Chai.expect(Object.keys(packageJsonDevDependencies).length).to.be.equal(21);
        });

        it("can be called with unit runner and no e2e runner", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileWriteBinary").resolves();
            sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "Karma";
            uniteConfigurationStub.e2eTestRunner = "None";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            Chai.expect(stub.callCount).to.be.equal(28);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal("1.2.3");
            Chai.expect(Object.keys(packageJsonDevDependencies).length).to.be.equal(22);
        });

        it("can be called with no unit runner and e2e runner", async () => {
            const stub = sandbox.stub(fileSystemMock, "fileWriteBinary").resolves();
            sandbox.stub(fileSystemMock, "directoryCreate").resolves();
            uniteConfigurationStub.sourceLanguage = "JavaScript";
            uniteConfigurationStub.bundler = "RequireJS";
            uniteConfigurationStub.moduleType = "AMD";
            uniteConfigurationStub.linter = "ESLint";
            uniteConfigurationStub.cssPre = "Css";
            uniteConfigurationStub.cssPost = "PostCss";
            uniteConfigurationStub.unitTestRunner = "None";
            uniteConfigurationStub.e2eTestRunner = "Protractor";
            uniteConfigurationStub.server = "BrowserSync";
            const obj = new Gulp();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);
            const res = await obj.process(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub);

            Chai.expect(res).to.be.equal(0);

            Chai.expect(stub.callCount).to.be.equal(29);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.del).to.be.equal("1.2.3");
            Chai.expect(Object.keys(packageJsonDevDependencies).length).to.be.equal(22);
        });
    });
});
