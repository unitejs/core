/**
 * Tests for GenNamePascal enum.
 */
import chai from "chai";
import { GenNamePascal } from "../../src/gen-name-snake";

describe("GenNamePascal", () => {
    it("can be created", () => {
        chai.should().exist(GenNamePascal);
    });
});
