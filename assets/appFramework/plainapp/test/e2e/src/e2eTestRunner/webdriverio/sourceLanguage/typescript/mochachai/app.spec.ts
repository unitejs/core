/**
 * Tests for App.
 */
/// <reference types="unitejs-plain-webdriver-plugin"/>
import { expect } from "chai";

describe("App", () => {
    it("the title is set", () => {
        const uniteJson = require("../../../../unite.json");
        return browser
            .url("/")
            .getTitle()
            .then((title) => {
                expect(title).to.equal(uniteJson.title);
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
});

// Generated by UniteJS