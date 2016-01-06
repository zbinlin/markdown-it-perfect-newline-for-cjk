"use strict";

const fs = require("fs");
const path = require("path");
const helper = require("./helper");

/**
 * {@link https://en.wikipedia.org/wiki/CJK_Unified_Ideographs}
 */
const CJK_RANGE = [
    [0x4E00, 0x9FD5],
    [0x3400, 0x4DBF],
    [0x20000, 0x2A6DF],
    [0x2A700, 0x2B73F],
    [0x2B740, 0x2B81F],
    [0x2B820, 0x2CEAF],
    [0xF900, 0xFAFF],
];

function cjkRangeToRegExp(ranges) {
    let reStr = helper.reduceRanges(helper.sortRanges(ranges)).map(range => {
        let rst = helper.rangeToString(range);
        if (Array.isArray(rst)) {
            return rst.join("|");
        } else {
            return rst;
        }
    }).join("|");

    return new RegExp(reStr);
}

const reCJKRange = cjkRangeToRegExp(CJK_RANGE);

const exportSource = `"use strict";

module.exports = ${reCJKRange};
`;

const OUT = path.join(__dirname, "cjk-range-regexp.js");
fs.writeFileSync(OUT, exportSource.toString(), {
    encoding: "UTF-8",
});
