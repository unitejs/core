/**
 * Tests for App.
 */
import * as chaiModule from "chai";
const chai = (chaiModule as any).default || chaiModule;
import { App } from "../../../src/app";

describe("App", () => {
    it("can be created", () => {
        const app = new App();
        chai.should().exist(app);
    });
});

// Generated by UniteJS
