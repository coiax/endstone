/**
 * Test that expected globals are available and present in the testing
 * suite, just like they are in the screeps interpreter.
 */
import { assert } from "chai";

describe("screeps constant (OK)", function () {
    it("should be equal to 0", function () {
        assert.equal(OK, 0);
    });
});

describe("lodash", function () {
    it("should be available", function () {
        assert.equal(_.VERSION, "3.10.1");
    });
});
