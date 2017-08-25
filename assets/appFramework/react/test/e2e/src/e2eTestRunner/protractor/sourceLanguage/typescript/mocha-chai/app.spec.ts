/**
 * Tests for App.
 */
/// <reference types="unitejs-react-protractor-plugin"/>
import { expect } from "chai";
import { $, browser, by } from "protractor";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../../unite.json");
        browser.get("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).to.equal(uniteJson.title);
                        done();
                    });
            });
    });

    it("the root text is set", (done) => {
        browser.loadAndWaitForReactPage("/")
            .then(() => {
                $("#root > span").getText()
                    .then((rootContent) => {
                        expect(rootContent).to.equal("Hello UniteJS World!");
                        done();
                    });
            });
    });
});

// Generated by UniteJS
