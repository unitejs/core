/**
 * Tests for HtmlTemplate.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { HtmlTemplateConfiguration } from "../../../../../src/configuration/models/htmlTemplate/htmlTemplateConfiguration";
import { UniteConfiguration } from "../../../../../src/configuration/models/unite/uniteConfiguration";
import { EngineVariables } from "../../../../../src/engine/engineVariables";
import { HtmlTemplate } from "../../../../../src/pipelineSteps/content/htmlTemplate";
import { FileSystemMock } from "../../fileSystem.mock";

describe("HtmlTemplate", () => {
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

        engineVariablesStub = new EngineVariables();
        engineVariablesStub.setupDirectories(fileSystemMock, "./test/unit/temp");
    });

    afterEach(async () => {
        sandbox.restore();
        await fileSystemMock.directoryDelete("./test/unit/temp");
    });

    it("can be created", () => {
        const obj = new HtmlTemplate();
        Chai.should().exist(obj);
    });

    describe("initialise", () => {
        it("can setup the engine configuration", async () => {
            const obj = new HtmlTemplate();
            const res = await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLBundle").head.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLBundle").body.length).to.be.equal(3);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").head.length).to.be.equal(0);
            Chai.expect(engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle").body.length).to.be.equal(0);
        });
    });

    describe("finalise", () => {
        it("can fail if an exception is thrown", async () => {
            const obj = new HtmlTemplate();
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(1);
            Chai.expect(loggerErrorSpy.args[0][0]).contains("failed");
        });

        it("can skip if file has no generated marker", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", "index-no-bundle.html", []);

            const obj = new HtmlTemplate();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Skipping");
        });

        it("can write if file has a generated marker an no other additions", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", "index-no-bundle.html", ["Generated by UniteJS"]);

            const obj = new HtmlTemplate();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Writing");

            const lines = await fileSystemMock.fileReadLines("./test/unit/temp/www/", "index-no-bundle.html");
            Chai.expect(lines.length).to.be.equal(19);
        });

        it("can write if file has a generated marker", async () => {
            await fileSystemMock.directoryCreate("./test/unit/temp/www/");
            await fileSystemMock.fileWriteLines("./test/unit/temp/www/", "index-no-bundle.html", ["Generated by UniteJS"]);

            const obj = new HtmlTemplate();
            await obj.initialise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);

            const htmlTemplateConfiguration = engineVariablesStub.getConfiguration<HtmlTemplateConfiguration>("HTMLNoBundle");
            htmlTemplateConfiguration.head.push("head1");
            htmlTemplateConfiguration.body.push("body2");

            const res = await obj.finalise(loggerStub, fileSystemMock, uniteConfigurationStub, engineVariablesStub, true);
            Chai.expect(res).to.be.equal(0);
            Chai.expect(loggerInfoSpy.args[0][0]).contains("Writing");

            const lines = await fileSystemMock.fileReadLines("./test/unit/temp/www/", "index-no-bundle.html");
            Chai.expect(lines.length).to.be.equal(21);
            Chai.expect(lines.findIndex(line => line.indexOf("head1") > 0)).to.be.equal(7);
            Chai.expect(lines.findIndex(line => line.indexOf("body2") > 0)).to.be.equal(13);
        });
    });
});
