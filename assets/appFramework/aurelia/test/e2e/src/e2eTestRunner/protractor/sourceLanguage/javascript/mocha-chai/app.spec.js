/**
 * Tests for App.
 */
import {expect} from "chai";

describe("App", () => {
    it("the title is set", (done) => {
        const uniteJson = require("../../../unite.json");
        browser.loadAndWaitForAureliaPage("/")
            .then(() => {
                browser.getTitle()
                    .then((title) => {
                        expect(title).to.equal(uniteJson.title);
                        done();
                    });
            });
    });

    it("the router text is set", (done) => {
        browser.loadAndWaitForAureliaPage("/")
            .then(() => {
                $("router-view").getText()
                    .then((routerContent) => {
                        expect(routerContent).to.equal("Hello UniteJS World!");
                        done();
                    });
            });
    });
});

/* Generated by UniteJS */