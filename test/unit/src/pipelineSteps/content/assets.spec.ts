/**
 * Tests for Assets.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { Assets } from "../../../../../src/pipelineSteps/content/assets";
import { FileSystemMock } from "../../fileSystem.mock";

describe("Assets", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let loggerErrorSpy: Sinon.SinonSpy;
    let fileSystemMock: IFileSystem;
    let uniteConfigurationStub: UniteConfiguration;
    let engineVariablesStub: EngineVariables;

    beforeEach(() => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemMock = new FileSystemMock();
        uniteConfigurationStub = new UniteConfiguration();

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
        const obj = new Assets();
        Chai.should().exist(obj);
    });

    describe("configure", () => {
        it("can be called", async () => {
            const obj = new Assets();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = {};
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["unitejs-image-cli"]).to.be.equal("1.2.3");
        });

        it("can be called with false mainCondition", async () => {
            const obj = new Assets();
            const res = await obj.configure(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, false);
            Chai.expect(res).to.be.equal(0);

            const packageJsonDevDependencies: { [id: string]: string } = { "unitejs-image-cli": "1.2.3" };
            engineVariablesStub.buildDevDependencies(packageJsonDevDependencies);

            Chai.expect(packageJsonDevDependencies["unitejs-image-cli"]).to.be.equal(undefined);
        });
    });

    describe("finalise", () => {
        it("can fail when asset source folder create fails", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate").rejects();

            const obj = new Assets();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when asset folder create fails", async () => {
            sandbox.stub(fileSystemMock, "directoryCreate")
                .onFirstCall().resolves()
                .onSecondCall().rejects();

            const obj = new Assets();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when first file copy fails", async () => {
            sandbox.stub(fileSystemMock, "fileWriteText").rejects();

            const obj = new Assets();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can fail when second file copy fails", async () => {
            sandbox.stub(fileSystemMock, "fileWriteText").onSecondCall().rejects();

            const obj = new Assets();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);

            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can succeed", async () => {
            const obj = new Assets();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);

            let exists = await fileSystemMock.directoryExists("./test/unit/temp/www/assets/");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.directoryExists("./test/unit/temp/www/assetsSrc/");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/assetsSrc/theme", "logo-tile.svg");
            Chai.expect(exists).to.be.equal(true);

            exists = await fileSystemMock.fileExists("./test/unit/temp/www/assetsSrc/theme", "logo-transparent.svg");
            Chai.expect(exists).to.be.equal(true);
        });
    });
});
