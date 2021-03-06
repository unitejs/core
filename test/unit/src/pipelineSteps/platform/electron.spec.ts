/**
 * Tests for Electron.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Electron } from "../../../../../src/pipelineSteps/platform/electron";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Electron", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();
        uniteConfigurationStub.platforms = { Electron: {}};
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
        const obj = new Electron();
        Chai.should().exist(obj);
    });

    describe("mainCondition", () => {
        it("can be called with not matching condition", async () => {
            const obj = new Electron();
            uniteConfigurationStub.platforms = {};
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(false);
        });

        it("can be called with matching condition", async () => {
            const obj = new Electron();
            const res = obj.mainCondition(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(res).to.be.equal(true);
        });
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new Electron();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.archiver).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal("1.2.3");
            Chai.expect(packageJsonDevDependencies["unitejs-image-cli"]).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new Electron();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {
                archiver: "1.2.3",
                "electron-packager": "1.2.3",
                "unitejs-image-cli": "1.2.3"
            };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);
            Chai.expect(packageJsonDevDependencies.archiver).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["electron-packager"]).to.be.equal(undefined);
            Chai.expect(packageJsonDevDependencies["unitejs-image-cli"]).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can do nothing if not gulp", async () => {
            uniteConfigurationStub.taskManager = undefined;
            const stub = sandbox.stub(fileSystemMock, "pathCombine");
            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            Chai.expect(res).to.be.equal(0);
            Chai.expect(stub.callCount).to.be.equal(2);
        });

        it("can fail creating platform folder", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").rejects();
            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail copying asset file", async () => {
            sandbox.stub(fileSystemMock, "fileReadText").rejects();
            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can fail copying second asset file", async () => {
            sandbox.stub(fileSystemMock, "fileReadText").onSecondCall().rejects();
            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
        });

        it("can succeed", async () => {
            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/tasks/", "platform-electron.js");
            Chai.expect(exists).to.be.equal(true);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/assets/platform/electron/", "main.js");
            Chai.expect(exists).to.be.equal(true);
        });

        it("can fail if delete file erros with false mainCondition", async () => {
            sandbox.stub(fileSystemMock, "fileExists").resolves(true);
            sandbox.stub(fileSystemMock, "fileReadLines").resolves(["Generated by UniteJS"]);
            sandbox.stub(fileSystemMock, "fileDelete").rejects();

            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(1);
        });

        it("can be called with false mainCondition", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/build/tasks/");
            await fileSystemMock.directoryCreate("./test/unit/temp/www/build/tasks/assets/platform/electron");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/build/tasks/", "platform-electron.js", "Generated by UniteJS");
            await fileSystemMock.fileWriteText("./test/unit/temp/www/build/tasks/assets/platform/electron", "main.js", "Generated by UniteJS");

            const obj = new Electron();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/tasks/", "platform-electron.js");
            Chai.expect(exists).to.be.equal(false);
            exists = await fileSystemMock.fileExists("./test/unit/temp/www/build/assets/platform/electron/", "main.js");
            Chai.expect(exists).to.be.equal(false);
        });
    });
});
