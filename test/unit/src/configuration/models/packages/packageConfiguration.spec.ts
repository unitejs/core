/**
 * Tests for PackageConfiguration.
 */
import * as Chai from "chai";
import { PackageConfiguration } from "../../../../../../src/configuration/models/packages/packageConfiguration";

describe("PackageConfiguration", () => {
    it("can be created", async() => {
        const obj = new PackageConfiguration();
        Chai.should().exist(obj);
    });
});
