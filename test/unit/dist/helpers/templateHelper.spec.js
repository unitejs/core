"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for Template Helper
 */
const Chai = require("chai");
const templateHelper_1 = require("../../../../dist/helpers/templateHelper");
describe("TemplateHelper", () => {
    describe("generateSubstitutions", () => {
        it("can be called with undefined string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions(undefined, undefined);
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with an empty string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with an no alpha num string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "!£$%^&");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with a single lower case character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "a");
            Chai.expect(res).to.be.deep.equal({
                PRE: "a",
                PRE_SNAKE: "a",
                PRE_CAMEL: "a",
                PRE_PASCAL: "A",
                PRE_HUMAN: "A"
            });
        }));
        it("can be called with a single upper case character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "A");
            Chai.expect(res).to.be.deep.equal({
                PRE: "A",
                PRE_SNAKE: "a",
                PRE_CAMEL: "a",
                PRE_PASCAL: "A",
                PRE_HUMAN: "A"
            });
        }));
        it("can be called with a single whitespace character", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", " ");
            Chai.expect(res).to.be.deep.equal({});
        }));
        it("can be called with a single word lower case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "ape",
                PRE_SNAKE: "ape",
                PRE_CAMEL: "ape",
                PRE_PASCAL: "Ape",
                PRE_HUMAN: "Ape"
            });
        }));
        it("can be called with a single word UPPER case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "APE");
            Chai.expect(res).to.be.deep.equal({
                PRE: "APE",
                PRE_SNAKE: "ape",
                PRE_CAMEL: "aPE",
                PRE_PASCAL: "APE",
                PRE_HUMAN: "APE"
            });
        }));
        it("can be called with a multiple words lower case", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "great ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        }));
        it("can be called with a multiple words title cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "Great Ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "Great Ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        }));
        it("can be called with a multiple words camel cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "GreatApe");
            Chai.expect(res).to.be.deep.equal({
                PRE: "GreatApe",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        }));
        it("can be called with a multiple words snake cased", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "great-ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great-ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        }));
        it("can be called with a multiple word and multiple separators", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.generateSubstitutions("PRE", "great     ape");
            Chai.expect(res).to.be.deep.equal({
                PRE: "great ape",
                PRE_SNAKE: "great-ape",
                PRE_CAMEL: "greatApe",
                PRE_PASCAL: "GreatApe",
                PRE_HUMAN: "Great Ape"
            });
        }));
    });
    describe("replaceSubstitutions", () => {
        it("can be called with undefined string", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions(undefined, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with undefined string and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, undefined);
            Chai.expect(res).to.be.equal(undefined);
        }));
        it("can be called with defined string with no template matches and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah");
            Chai.expect(res).to.be.equal("blah");
        }));
        it("can be called with defined string and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah {PRE_NAME} poo");
            Chai.expect(res).to.be.equal("blah aaa poo");
        }));
        it("can be called with defined string with muitple matches and defined substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa"
            }, "blah {PRE_NAME} poo {PRE_NAME}");
            Chai.expect(res).to.be.equal("blah aaa poo aaa");
        }));
        it("can be called with defined string with muitple matches and multiple substitutions", () => __awaiter(this, void 0, void 0, function* () {
            const res = templateHelper_1.TemplateHelper.replaceSubstitutions({
                PRE_NAME: "aaa",
                POST_NAME: "bbb"
            }, "blah {PRE_NAME} poo {PRE_NAME} {POST_NAME}");
            Chai.expect(res).to.be.equal("blah aaa poo aaa bbb");
        }));
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvaGVscGVycy90ZW1wbGF0ZUhlbHBlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3Qiw0RUFBeUU7QUFFekUsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3ZCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUM5QixFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDdEMsTUFBTSxHQUFHLEdBQUcsK0JBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUNyQyxNQUFNLEdBQUcsR0FBRywrQkFBYyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzVDLE1BQU0sR0FBRyxHQUFHLCtCQUFjLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDbkQsTUFB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RSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImhlbHBlcnMvdGVtcGxhdGVIZWxwZXIuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFRlbXBsYXRlIEhlbHBlclxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZUhlbHBlciB9IGZyb20gXCIuLi8uLi8uLi8uLi9kaXN0L2hlbHBlcnMvdGVtcGxhdGVIZWxwZXJcIjtcblxuZGVzY3JpYmUoXCJUZW1wbGF0ZUhlbHBlclwiLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoXCJnZW5lcmF0ZVN1YnN0aXR1dGlvbnNcIiwgKCkgPT4ge1xuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCB1bmRlZmluZWQgc3RyaW5nXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe30pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhbiBlbXB0eSBzdHJpbmdcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHt9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYW4gbm8gYWxwaGEgbnVtIHN0cmluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJQUkVcIiwgXCIhwqMkJV4mXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHt9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBzaW5nbGUgbG93ZXIgY2FzZSBjaGFyYWN0ZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiYVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgUFJFOiBcImFcIixcbiAgICAgICAgICAgICAgICBQUkVfU05BS0U6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFBSRV9DQU1FTDogXCJhXCIsXG4gICAgICAgICAgICAgICAgUFJFX1BBU0NBTDogXCJBXCIsXG4gICAgICAgICAgICAgICAgUFJFX0hVTUFOOiBcIkFcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlIHVwcGVyIGNhc2UgY2hhcmFjdGVyXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIlBSRVwiLCBcIkFcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIFBSRTogXCJBXCIsXG4gICAgICAgICAgICAgICAgUFJFX1NOQUtFOiBcImFcIixcbiAgICAgICAgICAgICAgICBQUkVfQ0FNRUw6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFBSRV9QQVNDQUw6IFwiQVwiLFxuICAgICAgICAgICAgICAgIFBSRV9IVU1BTjogXCJBXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZSB3aGl0ZXNwYWNlIGNoYXJhY3RlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJQUkVcIiwgXCIgXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHt9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggYSBzaW5nbGUgd29yZCBsb3dlciBjYXNlXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIlBSRVwiLCBcImFwZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgUFJFOiBcImFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9TTkFLRTogXCJhcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfQ0FNRUw6IFwiYXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX1BBU0NBTDogXCJBcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfSFVNQU46IFwiQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZSB3b3JkIFVQUEVSIGNhc2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiQVBFXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBQUkU6IFwiQVBFXCIsXG4gICAgICAgICAgICAgICAgUFJFX1NOQUtFOiBcImFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9DQU1FTDogXCJhUEVcIixcbiAgICAgICAgICAgICAgICBQUkVfUEFTQ0FMOiBcIkFQRVwiLFxuICAgICAgICAgICAgICAgIFBSRV9IVU1BTjogXCJBUEVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgbXVsdGlwbGUgd29yZHMgbG93ZXIgY2FzZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5nZW5lcmF0ZVN1YnN0aXR1dGlvbnMoXCJQUkVcIiwgXCJncmVhdCBhcGVcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmRlZXAuZXF1YWwoe1xuICAgICAgICAgICAgICAgIFBSRTogXCJncmVhdCBhcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfU05BS0U6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX0NBTUVMOiBcImdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX1BBU0NBTDogXCJHcmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9IVU1BTjogXCJHcmVhdCBBcGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgbXVsdGlwbGUgd29yZHMgdGl0bGUgY2FzZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiR3JlYXQgQXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBQUkU6IFwiR3JlYXQgQXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX1NOQUtFOiBcImdyZWF0LWFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9DQU1FTDogXCJncmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9QQVNDQUw6IFwiR3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfSFVNQU46IFwiR3JlYXQgQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIG11bHRpcGxlIHdvcmRzIGNhbWVsIGNhc2VkXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLmdlbmVyYXRlU3Vic3RpdHV0aW9ucyhcIlBSRVwiLCBcIkdyZWF0QXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBQUkU6IFwiR3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfU05BS0U6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX0NBTUVMOiBcImdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX1BBU0NBTDogXCJHcmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9IVU1BTjogXCJHcmVhdCBBcGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGEgbXVsdGlwbGUgd29yZHMgc25ha2UgY2FzZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiZ3JlYXQtYXBlXCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5kZWVwLmVxdWFsKHtcbiAgICAgICAgICAgICAgICBQUkU6IFwiZ3JlYXQtYXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX1NOQUtFOiBcImdyZWF0LWFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9DQU1FTDogXCJncmVhdEFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9QQVNDQUw6IFwiR3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfSFVNQU46IFwiR3JlYXQgQXBlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBhIG11bHRpcGxlIHdvcmQgYW5kIG11bHRpcGxlIHNlcGFyYXRvcnNcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gVGVtcGxhdGVIZWxwZXIuZ2VuZXJhdGVTdWJzdGl0dXRpb25zKFwiUFJFXCIsIFwiZ3JlYXQgICAgIGFwZVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZGVlcC5lcXVhbCh7XG4gICAgICAgICAgICAgICAgUFJFOiBcImdyZWF0IGFwZVwiLFxuICAgICAgICAgICAgICAgIFBSRV9TTkFLRTogXCJncmVhdC1hcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfQ0FNRUw6IFwiZ3JlYXRBcGVcIixcbiAgICAgICAgICAgICAgICBQUkVfUEFTQ0FMOiBcIkdyZWF0QXBlXCIsXG4gICAgICAgICAgICAgICAgUFJFX0hVTUFOOiBcIkdyZWF0IEFwZVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInJlcGxhY2VTdWJzdGl0dXRpb25zXCIsICgpID0+IHtcbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggdW5kZWZpbmVkIHN0cmluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCBzdHJpbmcgYW5kIGRlZmluZWQgc3Vic3RpdHV0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUFJFX05BTUU6IFwiYWFhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBkZWZpbmVkIHN0cmluZyB3aXRoIG5vIHRlbXBsYXRlIG1hdGNoZXMgYW5kIGRlZmluZWQgc3Vic3RpdHV0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUFJFX05BTUU6IFwiYWFhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJsYWhcIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiYmxhaFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJjYW4gYmUgY2FsbGVkIHdpdGggZGVmaW5lZCBzdHJpbmcgYW5kIGRlZmluZWQgc3Vic3RpdHV0aW9uc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBUZW1wbGF0ZUhlbHBlci5yZXBsYWNlU3Vic3RpdHV0aW9ucyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUFJFX05BTUU6IFwiYWFhXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJsYWgge1BSRV9OQU1FfSBwb29cIik7XG4gICAgICAgICAgICBDaGFpLmV4cGVjdChyZXMpLnRvLmJlLmVxdWFsKFwiYmxhaCBhYWEgcG9vXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcImNhbiBiZSBjYWxsZWQgd2l0aCBkZWZpbmVkIHN0cmluZyB3aXRoIG11aXRwbGUgbWF0Y2hlcyBhbmQgZGVmaW5lZCBzdWJzdGl0dXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLnJlcGxhY2VTdWJzdGl0dXRpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQUkVfTkFNRTogXCJhYWFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmxhaCB7UFJFX05BTUV9IHBvbyB7UFJFX05BTUV9XCIpO1xuICAgICAgICAgICAgQ2hhaS5leHBlY3QocmVzKS50by5iZS5lcXVhbChcImJsYWggYWFhIHBvbyBhYWFcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiY2FuIGJlIGNhbGxlZCB3aXRoIGRlZmluZWQgc3RyaW5nIHdpdGggbXVpdHBsZSBtYXRjaGVzIGFuZCBtdWx0aXBsZSBzdWJzdGl0dXRpb25zXCIsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IFRlbXBsYXRlSGVscGVyLnJlcGxhY2VTdWJzdGl0dXRpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQUkVfTkFNRTogXCJhYWFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQT1NUX05BTUU6IFwiYmJiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJsYWgge1BSRV9OQU1FfSBwb28ge1BSRV9OQU1FfSB7UE9TVF9OQU1FfVwiKTtcbiAgICAgICAgICAgIENoYWkuZXhwZWN0KHJlcykudG8uYmUuZXF1YWwoXCJibGFoIGFhYSBwb28gYWFhIGJiYlwiKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==