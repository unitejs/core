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
 * Tests for Pipeline.
 */
const Chai = require("chai");
const Sinon = require("sinon");
const uniteConfiguration_1 = require("../../../../dist/configuration/models/unite/uniteConfiguration");
const engineVariables_1 = require("../../../../dist/engine/engineVariables");
const pipeline_1 = require("../../../../dist/engine/pipeline");
const pipelineKey_1 = require("../../../../dist/engine/pipelineKey");
const pipelineStepBase_1 = require("../../../../dist/engine/pipelineStepBase");
const fileSystem_mock_1 = require("../fileSystem.mock");
class TestStep extends pipelineStepBase_1.PipelineStepBase {
    constructor() {
        super();
        this.initFail = 0;
        this.configureFail = 0;
        this.finaliseFail = 0;
    }
    mainCondition(uniteConfiguration, engineVariables) {
        return this.mainCond;
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initFail === 2) {
                throw (new Error("error!"));
            }
            return this.initFail;
        });
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configureFail === 2) {
                throw (new Error("error!"));
            }
            return this.configureFail;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.finaliseFail === 2) {
                throw (new Error("error!"));
            }
            return this.finaliseFail;
        });
    }
}
describe("Pipeline", () => {
    let sandbox;
    let loggerStub;
    let fileSystemStub;
    let uniteConfigurationStub;
    let engineVariablesStub;
    let loggerErrorSpy;
    let modulePath;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox = Sinon.createSandbox();
        loggerStub = {};
        loggerStub.info = () => { };
        loggerStub.error = () => { };
        loggerErrorSpy = sandbox.spy(loggerStub, "error");
        fileSystemStub = new fileSystem_mock_1.FileSystemMock();
        modulePath = fileSystemStub.pathAbsolute("./test/unit/dist/mocks");
        uniteConfigurationStub = new uniteConfiguration_1.UniteConfiguration();
        engineVariablesStub = new engineVariables_1.EngineVariables();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        sandbox.restore();
    }));
    it("can be created", () => {
        const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
        Chai.should().exist(obj);
    });
    describe("add", () => {
        it("can add a pipeline step", () => {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            Chai.should().exist(obj);
        });
    });
    describe("run", () => {
        it("can run a pipeline with no steps", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can run a pipeline with non existing step", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("cat1", "key1");
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        }));
        it("can run a pipeline with existing step", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step initialise fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step initialise throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step initialise", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.initFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step configure mainCondition true fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step configure mainCondition true throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step configuremainCondition true ", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step configure mainCondition false fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step configure mainCondition false throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step configure mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.configureFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step finalise mainCondition false true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step finalise mainCondition true throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step finalise mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can fail pipeline with step finalise mainCondition false fail", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 1;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can fail pipeline with step finalise mainCondition false throws exception", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 2;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub);
            Chai.expect(ret).to.be.equal(1);
        }));
        it("can succeed pipeline with step mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with step mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, true);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with step mainCondition true no logging", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.finaliseFail = 0;
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, undefined, false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with no steps and mainCondition false", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = false;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
        }));
        it("can succeed pipeline with no steps and mainCondition true", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            obj.add("engine", "dummyStep.mock");
            const testStep = new TestStep();
            testStep.mainCond = true;
            obj.tryLoad = sandbox.stub().returns(true);
            obj.getStep = sandbox.stub().returns(testStep);
            const ret = yield obj.run(uniteConfigurationStub, engineVariablesStub, [], false);
            Chai.expect(ret).to.be.equal(0);
        }));
    });
    describe("getStep", () => {
        it("can fail to get a step with no key", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(undefined);
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step with no category", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey(undefined, undefined));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step with no key property", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("cat", undefined));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can fail to get a step when it has not been loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("cat", "key"));
            Chai.expect(ret).to.be.equal(undefined);
        }));
        it("can get a step when it has been loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            const ret = obj.getStep(new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).not.to.be.equal(undefined);
        }));
    });
    describe("tryLoad", () => {
        it("can fail with no key", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, undefined);
            Chai.expect(ret).to.be.equal(false);
        }));
        it("can fail with no key property", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", undefined));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("should not be blank");
        }));
        it("can fail with not existing module", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("could not be located");
        }));
        it("can fail with file system exception", () => __awaiter(this, void 0, void 0, function* () {
            fileSystemStub.directoryGetFiles = sandbox.stub().rejects("kaboom");
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "blah"));
            Chai.expect(ret).to.be.equal(false);
            Chai.expect(loggerErrorSpy.args[0][0]).to.contains("failed to load");
        }));
        it("can succeed with existing module", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        }));
        it("can succeed when module already loaded", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"));
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.engine).to.be.equal("DummyStep");
        }));
        it("can succeed with aliased configuration type", () => __awaiter(this, void 0, void 0, function* () {
            const obj = new pipeline_1.Pipeline(loggerStub, fileSystemStub, modulePath);
            const ret = yield obj.tryLoad(uniteConfigurationStub, new pipelineKey_1.PipelineKey("engine", "dummyStep.mock"), "otherEngine");
            Chai.expect(ret).to.be.equal(true);
            Chai.expect(uniteConfigurationStub.otherEngine).to.be.equal("DummyStep");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUcvQixzR0FBbUc7QUFDbkcsNEVBQXlFO0FBQ3pFLDhEQUEyRDtBQUMzRCxvRUFBaUU7QUFDakUsOEVBQTJFO0FBQzNFLHdEQUFvRDtBQUVwRCxjQUFlLFNBQVEsbUNBQWdCO0lBTW5DO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRU0sYUFBYSxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDO1FBQ3pGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzlKLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLE1BQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7S0FBQTtJQUVZLFNBQVMsQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLGFBQXNCOztZQUM3SixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixNQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUM5QjtZQUNELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFWSxRQUFRLENB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QUFHLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ25HLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQVMsRUFBRTtZQUN6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLG1CQUFRLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNqRSxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsSUFBSSx5QkFBVyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xILElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmUuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFBpcGVsaW5lLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgKiBhcyBTaW5vbiBmcm9tIFwic2lub25cIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NyYy9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9waXBlbGluZVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3JjL2VuZ2luZS9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi8uLi8uLi9zcmMvZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcbmltcG9ydCB7IEZpbGVTeXN0ZW1Nb2NrIH0gZnJvbSBcIi4uL2ZpbGVTeXN0ZW0ubW9ja1wiO1xuXG5jbGFzcyBUZXN0U3RlcCBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHB1YmxpYyBtYWluQ29uZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICBwdWJsaWMgaW5pdEZhaWw6IG51bWJlcjtcbiAgICBwdWJsaWMgY29uZmlndXJlRmFpbDogbnVtYmVyO1xuICAgIHB1YmxpYyBmaW5hbGlzZUZhaWw6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmluaXRGYWlsID0gMDtcbiAgICAgICAgdGhpcy5jb25maWd1cmVGYWlsID0gMDtcbiAgICAgICAgdGhpcy5maW5hbGlzZUZhaWwgPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5tYWluQ29uZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodGhpcy5pbml0RmFpbCA9PT0gMikge1xuICAgICAgICAgICAgdGhyb3cobmV3IEVycm9yKFwiZXJyb3IhXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbml0RmFpbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29uZmlndXJlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyZUZhaWwgPT09IDIpIHtcbiAgICAgICAgICAgIHRocm93KG5ldyBFcnJvcihcImVycm9yIVwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJlRmFpbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZmluYWxpc2UobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgaWYgKHRoaXMuZmluYWxpc2VGYWlsID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyhuZXcgRXJyb3IoXCJlcnJvciFcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXNlRmFpbDtcbiAgICB9XG59XG5cbmRlc2NyaWJlKFwiUGlwZWxpbmVcIiwgKCkgPT4ge1xuICAgIGxldCBzYW5kYm94OiBTaW5vbi5TaW5vblNhbmRib3g7XG4gICAgbGV0IGxvZ2dlclN0dWI6IElMb2dnZXI7XG4gICAgbGV0IGZpbGVTeXN0ZW1TdHViOiBJRmlsZVN5c3RlbTtcbiAgICBsZXQgdW5pdGVDb25maWd1cmF0aW9uU3R1YjogYW55O1xuICAgIGxldCBlbmdpbmVWYXJpYWJsZXNTdHViOiBFbmdpbmVWYXJpYWJsZXM7XG4gICAgbGV0IGxvZ2dlckVycm9yU3B5OiBTaW5vbi5TaW5vblNweTtcbiAgICBsZXQgbW9kdWxlUGF0aDogc3RyaW5nO1xuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAgIHNhbmRib3ggPSBTaW5vbi5jcmVhdGVTYW5kYm94KCk7XG4gICAgICAgIGxvZ2dlclN0dWIgPSA8SUxvZ2dlcj57fTtcbiAgICAgICAgbG9nZ2VyU3R1Yi5pbmZvID0gKCkgPT4geyB9O1xuICAgICAgICBsb2dnZXJTdHViLmVycm9yID0gKCkgPT4geyB9O1xuXG4gICAgICAgIGxvZ2dlckVycm9yU3B5ID0gc2FuZGJveC5zcHkobG9nZ2VyU3R1YiwgXCJlcnJvclwiKTtcblxuICAgICAgICBmaWxlU3lzdGVtU3R1YiA9IG5ldyBGaWxlU3lzdGVtTW9jaygpO1xuXG4gICAgICAgIG1vZHVsZVBhdGggPSBmaWxlU3lzdGVtU3R1Yi5wYXRoQWJzb2x1dGUoXCIuL3Rlc3QvdW5pdC9kaXN0L21vY2tzXCIpO1xuXG4gICAgICAgIHVuaXRlQ29uZmlndXJhdGlvblN0dWIgPSBuZXcgVW5pdGVDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIGVuZ2luZVZhcmlhYmxlc1N0dWIgPSBuZXcgRW5naW5lVmFyaWFibGVzKCk7XG4gICAgfSk7XG5cbiAgICBhZnRlckVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgICBzYW5kYm94LnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImFkZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGFkZCBhIHBpcGVsaW5lIHN0ZXBcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJjYXQxXCIsIFwia2V5MVwiKTtcbiAgICAgICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJ1blwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIHJ1biBhIHBpcGVsaW5lIHdpdGggbm8gc3RlcHNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBydW4gYSBwaXBlbGluZSB3aXRoIG5vbiBleGlzdGluZyBzdGVwXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiY2F0MVwiLCBcImtleTFcIik7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwiY291bGQgbm90IGJlIGxvY2F0ZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHJ1biBhIHBpcGVsaW5lIHdpdGggZXhpc3Rpbmcgc3RlcFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGluaXRpYWxpc2UgZmFpbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmluaXRGYWlsID0gMTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgaW5pdGlhbGlzZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuaW5pdEZhaWwgPSAyO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggc3RlcCBpbml0aWFsaXNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuaW5pdEZhaWwgPSAwO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHBpcGVsaW5lIHdpdGggc3RlcCBjb25maWd1cmUgbWFpbkNvbmRpdGlvbiB0cnVlIGZhaWxcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5jb25maWd1cmVGYWlsID0gMTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgY29uZmlndXJlIG1haW5Db25kaXRpb24gdHJ1ZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuY29uZmlndXJlRmFpbCA9IDI7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBzdGVwIGNvbmZpZ3VyZW1haW5Db25kaXRpb24gdHJ1ZSBcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5jb25maWd1cmVGYWlsID0gMDtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgY29uZmlndXJlIG1haW5Db25kaXRpb24gZmFsc2UgZmFpbFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmNvbmZpZ3VyZUZhaWwgPSAxO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgY29uZmlndXJlIG1haW5Db25kaXRpb24gZmFsc2UgdGhyb3dzIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmNvbmZpZ3VyZUZhaWwgPSAyO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSBmYWxzZTtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgY29uZmlndXJlIG1haW5Db25kaXRpb24gZmFsc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5jb25maWd1cmVGYWlsID0gMDtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGZpbmFsaXNlIG1haW5Db25kaXRpb24gZmFsc2UgdHJ1ZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmZpbmFsaXNlRmFpbCA9IDE7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGZpbmFsaXNlIG1haW5Db25kaXRpb24gdHJ1ZSB0aHJvd3MgZXhjZXB0aW9uXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMjtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2UgbWFpbkNvbmRpdGlvbiB0cnVlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMDtcbiAgICAgICAgICAgIG9iai50cnlMb2FkID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0cnVlKTtcbiAgICAgICAgICAgIG9iai5nZXRTdGVwID0gc2FuZGJveC5zdHViKCkucmV0dXJucyh0ZXN0U3RlcCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoucnVuKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIGVuZ2luZVZhcmlhYmxlc1N0dWIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCBwaXBlbGluZSB3aXRoIHN0ZXAgZmluYWxpc2UgbWFpbkNvbmRpdGlvbiBmYWxzZSBmYWlsXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMTtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgcGlwZWxpbmUgd2l0aCBzdGVwIGZpbmFsaXNlIG1haW5Db25kaXRpb24gZmFsc2UgdGhyb3dzIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmZpbmFsaXNlRmFpbCA9IDI7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1Yik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggc3RlcCBtYWluQ29uZGl0aW9uIGZhbHNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAuZmluYWxpc2VGYWlsID0gMDtcbiAgICAgICAgICAgIHRlc3RTdGVwLm1haW5Db25kID0gZmFsc2U7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBzdGVwIG1haW5Db25kaXRpb24gdHJ1ZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgb2JqLmFkZChcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpO1xuICAgICAgICAgICAgY29uc3QgdGVzdFN0ZXAgPSBuZXcgVGVzdFN0ZXAoKTtcbiAgICAgICAgICAgIHRlc3RTdGVwLmZpbmFsaXNlRmFpbCA9IDA7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IHRydWU7XG4gICAgICAgICAgICBvYmoudHJ5TG9hZCA9IHNhbmRib3guc3R1YigpLnJldHVybnModHJ1ZSk7XG4gICAgICAgICAgICBvYmouZ2V0U3RlcCA9IHNhbmRib3guc3R1YigpLnJldHVybnModGVzdFN0ZXApO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnJ1bih1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBlbmdpbmVWYXJpYWJsZXNTdHViLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCgwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gc3VjY2VlZCBwaXBlbGluZSB3aXRoIHN0ZXAgbWFpbkNvbmRpdGlvbiB0cnVlIG5vIGxvZ2dpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5maW5hbGlzZUZhaWwgPSAwO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSB0cnVlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgdW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBzdWNjZWVkIHBpcGVsaW5lIHdpdGggbm8gc3RlcHMgYW5kIG1haW5Db25kaXRpb24gZmFsc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIG9iai5hZGQoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKTtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RTdGVwID0gbmV3IFRlc3RTdGVwKCk7XG4gICAgICAgICAgICB0ZXN0U3RlcC5tYWluQ29uZCA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgW10sIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgcGlwZWxpbmUgd2l0aCBubyBzdGVwcyBhbmQgbWFpbkNvbmRpdGlvbiB0cnVlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBvYmouYWRkKFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXN0U3RlcCA9IG5ldyBUZXN0U3RlcCgpO1xuICAgICAgICAgICAgdGVzdFN0ZXAubWFpbkNvbmQgPSB0cnVlO1xuICAgICAgICAgICAgb2JqLnRyeUxvYWQgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRydWUpO1xuICAgICAgICAgICAgb2JqLmdldFN0ZXAgPSBzYW5kYm94LnN0dWIoKS5yZXR1cm5zKHRlc3RTdGVwKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai5ydW4odW5pdGVDb25maWd1cmF0aW9uU3R1YiwgZW5naW5lVmFyaWFibGVzU3R1YiwgW10sIGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJnZXRTdGVwXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gZmFpbCB0byBnZXQgYSBzdGVwIHdpdGggbm8ga2V5XCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHRvIGdldCBhIHN0ZXAgd2l0aCBubyBjYXRlZ29yeVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLmdldFN0ZXAobmV3IFBpcGVsaW5lS2V5KHVuZGVmaW5lZCwgdW5kZWZpbmVkKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgdG8gZ2V0IGEgc3RlcCB3aXRoIG5vIGtleSBwcm9wZXJ0eVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gb2JqLmdldFN0ZXAobmV3IFBpcGVsaW5lS2V5KFwiY2F0XCIsIHVuZGVmaW5lZCkpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBmYWlsIHRvIGdldCBhIHN0ZXAgd2hlbiBpdCBoYXMgbm90IGJlZW4gbG9hZGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkoXCJjYXRcIiwgXCJrZXlcIikpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBnZXQgYSBzdGVwIHdoZW4gaXQgaGFzIGJlZW4gbG9hZGVkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBvYmouZ2V0U3RlcChuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJkdW1teVN0ZXAubW9ja1wiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLm5vdC50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidHJ5TG9hZFwiLCAoKSA9PiB7XG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBubyBrZXlcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIG5vIGtleSBwcm9wZXJ0eVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIHVuZGVmaW5lZCkpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmV0KS50by5iZS5lcXVhbChmYWxzZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChsb2dnZXJFcnJvclNweS5hcmdzWzBdWzBdKS50by5jb250YWlucyhcInNob3VsZCBub3QgYmUgYmxhbmtcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGZhaWwgd2l0aCBub3QgZXhpc3RpbmcgbW9kdWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZShsb2dnZXJTdHViLCBmaWxlU3lzdGVtU3R1YiwgbW9kdWxlUGF0aCk7XG4gICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBvYmoudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLCBuZXcgUGlwZWxpbmVLZXkoXCJlbmdpbmVcIiwgXCJibGFoXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QobG9nZ2VyRXJyb3JTcHkuYXJnc1swXVswXSkudG8uY29udGFpbnMoXCJjb3VsZCBub3QgYmUgbG9jYXRlZFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gZmFpbCB3aXRoIGZpbGUgc3lzdGVtIGV4Y2VwdGlvblwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBmaWxlU3lzdGVtU3R1Yi5kaXJlY3RvcnlHZXRGaWxlcyA9IHNhbmRib3guc3R1YigpLnJlamVjdHMoXCJrYWJvb21cIik7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiYmxhaFwiKSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KGxvZ2dlckVycm9yU3B5LmFyZ3NbMF1bMF0pLnRvLmNvbnRhaW5zKFwiZmFpbGVkIHRvIGxvYWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBleGlzdGluZyBtb2R1bGVcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmVuZ2luZSkudG8uYmUuZXF1YWwoXCJEdW1teVN0ZXBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2hlbiBtb2R1bGUgYWxyZWFkeSBsb2FkZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2JqID0gbmV3IFBpcGVsaW5lKGxvZ2dlclN0dWIsIGZpbGVTeXN0ZW1TdHViLCBtb2R1bGVQYXRoKTtcbiAgICAgICAgICAgIGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IG9iai50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvblN0dWIsIG5ldyBQaXBlbGluZUtleShcImVuZ2luZVwiLCBcImR1bW15U3RlcC5tb2NrXCIpKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJldCkudG8uYmUuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdCh1bml0ZUNvbmZpZ3VyYXRpb25TdHViLmVuZ2luZSkudG8uYmUuZXF1YWwoXCJEdW1teVN0ZXBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIHN1Y2NlZWQgd2l0aCBhbGlhc2VkIGNvbmZpZ3VyYXRpb24gdHlwZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgUGlwZWxpbmUobG9nZ2VyU3R1YiwgZmlsZVN5c3RlbVN0dWIsIG1vZHVsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgb2JqLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uU3R1YiwgbmV3IFBpcGVsaW5lS2V5KFwiZW5naW5lXCIsIFwiZHVtbXlTdGVwLm1vY2tcIiksIFwib3RoZXJFbmdpbmVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXQpLnRvLmJlLmVxdWFsKHRydWUpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QodW5pdGVDb25maWd1cmF0aW9uU3R1Yi5vdGhlckVuZ2luZSkudG8uYmUuZXF1YWwoXCJEdW1teVN0ZXBcIik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
