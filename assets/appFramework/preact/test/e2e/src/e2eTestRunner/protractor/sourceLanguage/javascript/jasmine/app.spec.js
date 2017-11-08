/**
 * Tests for App.
 */
describe("App", () => {
    it("the title is set", (done) => {
        const uniteThemeJson = require("../../../assetsSrc/theme/unite-theme.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteThemeJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.loadAndWaitForPreactPage("/")
            .then(() => {
                $("#root > span").getText()
                    .then((rootContent) => {
                        expect(rootContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });

    it("the font size is set", (done) => {
        browser.loadAndWaitForPreactPage("/")
            .then(() => {
                $(".child").getCssValue("font-size")
                    .then((fontSize) => {
                        expect(fontSize).toEqual("20px");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */
