/**
 * Tests for App.
 */
import {App} from "../../../src/app";
import chai from "chai";

describe("App", () => {
    it("can be created", () => {
        const app = new App();
        chai.should().exist(app);
    });
});

/* Generated by UniteJS */
