/**
 * Tests for App.
 */
/// <reference types="unitejs-webdriver-plugin"/>

describe("App", () => {
    it("the title is set", () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        return browser
            .uniteLoadAndWaitForPage("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteThemeJson.title);
            });
    });

    it("the child text is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .customShadowRoot("#root unite-app::sr iron-pages unite-child::sr div")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });

    it("the font size is set", () => {
        return browser
            .uniteLoadAndWaitForPage("/")
            .customShadowRoot("#root unite-app::sr iron-pages unite-child::sr div")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).toEqual("20px");
            });
    });
});

// Generated by UniteJS