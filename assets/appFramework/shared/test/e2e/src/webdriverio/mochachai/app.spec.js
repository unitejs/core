/**
 * Tests for App.
 */
import {expect} from "chai";

describe("App", () => {
    it("the title is set", async () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        await browser
            .uniteLoadAndWaitForPage("/")
            .getTitle()
            .then((title) => {
                expect(title).to.equal(uniteThemeJson.title);
            });
    });

    it("the child text is set", async () => {
        await browser
            .uniteLoadAndWaitForPage("/")
            .element(".child")
            .getText()
            .then((rootContent) => {
                expect(rootContent).to.equal("Hello UniteJS World!");
            });
    });

    it("the font size is set", async () => {
        await browser
            .uniteLoadAndWaitForPage("/")
            .element(".child")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).to.equal("20px");
            });
    });
});

/* Generated by UniteJS */
