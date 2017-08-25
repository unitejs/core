/**
 * Tests for App.
 */
import { $, browser, by } from "protractor";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../../unite.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).toEqual(uniteJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.get("/")
            .then(() => {
                $("#root").getText()
                    .then((rootContent) => {
                        expect(rootContent).toEqual("Hello UniteJS World!");
                        done();
                    });
            });
    });
});

// Generated by UniteJS
