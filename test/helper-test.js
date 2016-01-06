"use strict";

/* eslint-env mocha */

const helper = require("../lib/helper");
const expect = require("chai").expect;

describe("./helper-test.js", function () {
    describe("test .sortRanges()", function () {
        it("sort array", function () {
            let source = [[10, 20], [5, 10]];
            const expected = [[5, 10], [10, 20]];
            expect(helper.sortRanges(source)).to.eql(expected);

            let source1 = [[10, 20], [10, 30], [20, 30]];
            const expected1 = [[10, 20], [10, 30], [20, 30]];
            expect(helper.sortRanges(source1)).to.eql(expected1);
        });
        it("sort range", function () {
            let source = [[20, 10]];
            const expected = [[10, 20]];
            expect(helper.sortRanges(source)).to.eql(expected);
        });
    });
    describe("test .reduceRanges()", function () {
        it("merge ranges", function () {
            let source = [[10, 20], [12, 30], [13, 25], [32, 40], [41, 45]];
            const expected = [[10, 30], [32, 45]];
            expect(helper.reduceRanges(source)).to.eql(expected);
        });
    });
    describe("test .rangeToString()", function () {
        it("returns regexp-style range", function () {
            let source1 = [0x10, 0x20];
            const expected1 = "[\\u0010-\\u0020]";
            expect(helper.rangeToString(source1)).to.equal(expected1);

            let source2 = [0x1c010, 0x1c410];
            const expected2 = ["\\uD830[\\uDC10-\\uDFFF]", "\\uD831[\\uDC00-\\uDC10]"];
            expect(helper.rangeToString(source2)).to.eql(expected2);

            let source3 = [0x10, 0x10];
            const expected3 = "\\u0010";
            expect(helper.rangeToString(source3)).to.equal(expected3);

            let source4 = [0x1c000, 0x1c000];
            const expected4 = "\\uD830\\uDC00";
            expect(helper.rangeToString(source4)).to.equal(expected4);

            let source5 = [0x20, 0x10];
            const expected5 = "[\\u0010-\\u0020]";
            expect(helper.rangeToString(source5)).to.equal(expected5);

            let source6 = [0x1c010, 0x1c015];
            const expected6 = "\\uD830[\\uDC10-\\uDC15]";
            expect(helper.rangeToString(source6)).to.equal(expected6);

            let source7 = [0x1c3ff, 0x1c800];
            const expected7 = ["\\uD830\\uDFFF", "\\uD832\\uDC00", "\\uD831[\\uDC00-\\uDFFF]"];
            expect(helper.rangeToString(source7)).to.eql(expected7);

            let source8 = [0x1c000, 0x1c7ff];
            const expected8 = "[\\uD830-\\uD831][\\uDC00-\\uDFFF]";
            expect(helper.rangeToString(source8)).to.eql(expected8);
        });
    });
});
