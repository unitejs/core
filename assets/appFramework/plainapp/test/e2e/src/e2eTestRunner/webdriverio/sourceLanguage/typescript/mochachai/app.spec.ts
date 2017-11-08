/**
 * Tests for App.
 */
/// <reference types="unitejs-plain-webdriver-plugin"/>
import { expect } from "chai";

describe("App", () => {
    it("the title is set", () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).to.equal(uniteThemeJson.title);
            });
    });

    it("the root text is set", () => {
        return browser
            .loadAndWaitForPlainPage("/")
            .element("#root")
            .getText()
            .then((rootContent) => {
                expect(rootContent).to.equal("Hello UniteJS World!");
            });
    });

    it("the font size is set", () => {
        return browser
            .loadAndWaitForPlainPage("/")
            .element(".child")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).to.equal("20px");
            });
    });
});

// Generated by UniteJS
