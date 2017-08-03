/**
 * Tests for Bootstrapper.
 */
import * as ChaiModule from "chai";
const Chai = (ChaiModule as any).default || ChaiModule;
import { bootstrap } from "../../../src/bootstrapper";

describe("Bootstrapper", () => {
    it("should contain bootstrap", (done) => {
        Chai.should().exist(bootstrap);
        done();
    });
});

/* Generated by UniteJS */