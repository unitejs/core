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
 * Tests for PackageConfiguration.
 */
const Chai = require("chai");
const packageConfiguration_1 = require("../../../../../../dist/configuration/models/packages/packageConfiguration");
describe("PackageConfiguration", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new packageConfiguration_1.PackageConfiguration();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0Isb0hBQWlIO0FBRWpILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUM3QixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=