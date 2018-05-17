/**
 * Tests for Pipeline.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { UniteConfiguration } from "../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../src/engine/engineVariables";
import { Pipeline } from "../../../../src/engine/pipeline";
import { PipelineKey } from "../../../../src/engine/pipelineKey";
import { PipelineStepBase } from "../../../../src/engine/pipelineStepBase";
import { FileSystemMock } from "../fileSystem.mock";

class TestStep extends PipelineStepBase {
    public mainCond: boolean | undefined;
    public initFail: number;
    public configureFail: number;
    public finaliseFail: number;

    constructor() {
        super();
        this.initFail = 0;
        this.configureFail = 0;
        this.finaliseFail = 0;
    }

    public mainCondition(uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables): boolean | undefined {
        return this.mainCond;
    }

    public async initialise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (this.initFail === 2) {
            throw(new Error("error!"));
        }
        return this.initFail;
    }

    public async configure(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (this.configureFail === 2) {
            throw(new Error("error!"));
        }
        return this.configureFail;
    }

    public async finalise(logger: ILogger, fileSystem: IFileSystem, uniteConfiguration: UniteConfiguration, engineVariables: EngineVariables, mainCondition: boolean): Promise<number> {
        if (this.finaliseFail === 2) {
            throw(new Error("error!"));
        }
        return this.finaliseFail;
    }
}

describe("Pipeline", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;
    let uniteConfigurationStub: any;
    let engineVariablesStub: EngineVariables;
    let loggerErrorSpy: Sinon.SinonSpy;
    let modulePath: string;

    beforeEach(async () => {
        sandbox = Sinon.createSandbox();
        loggerStub = <ILogger>{};
        loggerStub.info = () => { };
        loggerStub.error = () => { };

        loggerErrorSpy = sandbox.spy(loggerStub, "error");

        fileSystemStub = new FileSystemMock();

        modulePath = fileSystemStub.pathAbsolute("./test/unit/dist/mocks");

        uniteConfigurationStub = new UniteConfiguration();
        engineVariablesStub = new EngineVariables();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", () => {
        const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
        Chai.should().exist(obj);
    });

    describe("add", () => {
        it("can add a pipeline step", () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            Chai.should().exist(obj);
        });
    });

    describe("run", () => {
        it("can run a pipeline with no steps", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can run a pipeline with non existing step", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        });

        it("can run a pipeline with existing step", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step initialise fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step initialise throws exception", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can succeed pipeline with step initialise", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step configure mainCondition true fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step configure mainCondition true throws exception", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can succeed pipeline with step configuremainCondition true ", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step configure mainCondition false fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step configure mainCondition false throws exception", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can succeed pipeline with step configure mainCondition false", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step finalise mainCondition false true", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step finalise mainCondition true throws exception", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can succeed pipeline with step finalise mainCondition true", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can fail pipeline with step finalise mainCondition false fail", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can fail pipeline with step finalise mainCondition false throws exception", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        });

        it("can succeed pipeline with step mainCondition false", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can succeed pipeline with step mainCondition true", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub, undefined, true);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can succeed pipeline with step mainCondition true no logging", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can succeed pipeline with no steps and mainCondition false", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
        });

        it("can succeed pipeline with no steps and mainCondition true", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = await obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
        });
    });

    describe("getStep", () => {
        it("can fail to get a step with no key", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(undefined);
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step with no category", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey(undefined, undefined));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step with no key property", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey("cat", undefined));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can fail to get a step when it has not been loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new PipelineKey("cat", "key"));
            Chai.expect(ret).to.be.equal(undefined);
        });

        it("can get a step when it has been loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            const ret = obj.getStep(new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).not.to.be.equal(undefined);
        });
    });

    describe("tryLoad", () => {
        it("can fail with no key", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, undefined);
            Chai.expect(ret).to.be.equal(false);
        });

        it("can fail with no key property", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", undefined));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("should not be blank");
        });

        it("can fail with not existing module", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        });

        it("can fail with file system exception", async () => {
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("kaboom");
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("failed to load");
        });

        it("can succeed with existing module", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        });

        it("can succeed when module already loaded", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        });

        it("can succeed with aliased configuration type", async () => {
            const obj = new Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = await obj.tryLoad(uniteConfigurationStub, new PipelineKey("engine", "dummyStep.mock"), "otherEngine");
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.otherEngine).to.be.equal("DummyStep");
        });
    });
});
