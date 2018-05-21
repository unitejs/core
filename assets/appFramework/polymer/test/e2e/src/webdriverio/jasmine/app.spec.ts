/**
 * Tests for App.
 */
/// <reference types="unitejs-webdriver-plugin"/>

describe("App", () => {
    it("the title is set", async () => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        await browser
            .uniteLoadAndWaitForPage("/")
            .getTitle()
            .then((title) => {
                expect(title).toEqual(uniteThemeJson.title);
            });
    });

    it("the child text is set", async () => {
        await browser
            .uniteLoadAndWaitForPage("/")
            .customShadowRoot("#root unite-app::sr iron-pages unite-child::sr span")
            .getText()
            .then((rootContent) => {
                expect(rootContent).toEqual("Hello UniteJS World!");
            });
    });

    it("the font size is set", async () => {
        await browser
            .uniteLoadAndWaitForPage("/")
            .customShadowRoot("#root unite-app::sr iron-pages unite-child::sr span")
            .getCssProperty("font-size")
            .then((fontSize) => {
                expect(fontSize.value).toEqual("20px");
            });
    });
});

// Generated by UniteJS
