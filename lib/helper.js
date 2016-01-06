"use strict";

/**
 * @typedef {Array.<number>} Range
 */

/**
 * @public
 * @example
 * // returns [[1, 2], [10, 20]]
 * sortRange([10, 20], [2, 1]])
 * @param {Array.<Range>} ranges - range array
 * @return {Array.<Range>}
 */
exports.sortRanges = function sortRange(ranges) {
    return ranges.map(range => {
        if (range[0] > range[1]) {
            let tmp = range[0];
            range[0] = range[1];
            range[1] = tmp;
        }
        return range;
    }).sort((a, b) => {
        if (a[0] > b[0]) {
            return 1;
        } else if (a[0] < b[0]) {
            return -1;
        } else {
            return 0;
        }
    });
};

/**
 * @public
 * @example
 * // returns [[10, 20], [22, 30]]
 * reduceRange([[10, 15], [15, 20], [22, 25], [26, 30]])
 * @param {Array.<Range>} ranges - range array
 * @return {Array.<Range>}
 */
exports.reduceRanges = function reduceRange(ranges) {
    return ranges.reduce((ranges, curr) => {
        let prev = ranges[ranges.length - 1];
        if (prev && prev[1] >= (curr[0] - 1)) {
            if (prev[1] < curr[1]) {
                prev[1] = curr[1];
            }
        } else {
            ranges.push(curr.slice());
        }
        return ranges;
    }, []);
};

/**
 * @public
 * @example
 * // returns "[\\u0010-\\u0020]"
 * rangeToString([0x10, 0x20]);
 * // returns ["\\uD830[\\uDC10-\\uDFFF]", "\\uD831[\\uDC00-\\uDC10]"]
 * rangeToString([0x1c010, 0x0x1c410])
 * @param {Range} range
 * @return {Array.<string>|string}
 */
exports.rangeToString = function rangeToString(range) {
    const SUPPLEMENTARY_PLANES_BASE = 0x10000;
    const MARK = 0x3FF;
    const HIHG_SURROGATE_BASE = 0xD800;
    const LOW_SURROGATE_BASE = 0xDC00;
    const LOW_SURROGATE_MAX = LOW_SURROGATE_BASE + MARK;
    const LOW_SURROGATE_BASE_STRING = numToStr(LOW_SURROGATE_BASE);
    const LOW_SURROGATE_MAX_STRING = numToStr(LOW_SURROGATE_MAX);
    let start = range[0];
    let end = range[1];
    if (start > end) {
        start = range[1];
        end = range[0];
    }
    if (start < SUPPLEMENTARY_PLANES_BASE) {
        return start === end ? numToStr(start) : `[${numToStr(start)}-${numToStr(end)}]`;
    }
    let sOffset = start - SUPPLEMENTARY_PLANES_BASE;
    let eOffset = end - SUPPLEMENTARY_PLANES_BASE;

    let sHighSurrogateOffset = sOffset >>> 10 & MARK;
    let sLowSurrogateOffset = sOffset & MARK;
    let sHighSurrogate = HIHG_SURROGATE_BASE + sHighSurrogateOffset;
    let sLowSurrogate = LOW_SURROGATE_BASE + sLowSurrogateOffset;

    let eHighSurrogateOffset = eOffset >>> 10 & MARK;
    let eLowSurrogateOffset = eOffset & MARK;
    let eHighSurrogate = HIHG_SURROGATE_BASE + eHighSurrogateOffset;
    let eLowSurrogate = LOW_SURROGATE_BASE + eLowSurrogateOffset;

    let sHighSurrogateStr = numToStr(sHighSurrogate);
    let sLowSurrogateStr = numToStr(sLowSurrogate);
    let eHighSurrogateStr = numToStr(eHighSurrogate);
    let eLowSurrogateStr = numToStr(eLowSurrogate);

    if (start === end) {
        return `${sHighSurrogateStr}${sLowSurrogateStr}`;
    }

    if (sHighSurrogate === eHighSurrogate) {
        return `${sHighSurrogateStr}[${sLowSurrogateStr}-${eLowSurrogateStr}]`;
    }

    let rs = [];

    if (sLowSurrogateOffset !== 0) {
        if (sLowSurrogateOffset === MARK) {
            rs.push(`${sHighSurrogateStr}${LOW_SURROGATE_MAX_STRING}`);
        } else {
            rs.push(`${sHighSurrogateStr}[${sLowSurrogateStr}-${LOW_SURROGATE_MAX_STRING}]`);
        }
        sHighSurrogate += 1;
        sHighSurrogateStr = numToStr(sHighSurrogate);
    }
    if (eLowSurrogateOffset !== MARK) {
        if (eLowSurrogateOffset === 0) {
            rs.push(`${eHighSurrogateStr}${LOW_SURROGATE_BASE_STRING}`);
        } else {
            rs.push(`${eHighSurrogateStr}[${LOW_SURROGATE_BASE_STRING}-${eLowSurrogateStr}]`);
        }
        eHighSurrogate -= 1;
        eHighSurrogateStr = numToStr(eHighSurrogate);
    }
    if (sHighSurrogate < eHighSurrogate) {
        rs.push(`[${sHighSurrogateStr}-${eHighSurrogateStr}][${LOW_SURROGATE_BASE_STRING}-${LOW_SURROGATE_MAX_STRING}]`);
    } else if (sHighSurrogate === eHighSurrogate) {
        rs.push(`${sHighSurrogateStr}[${LOW_SURROGATE_BASE_STRING}-${LOW_SURROGATE_MAX_STRING}]`);
    }

    return rs.length > 1 ? rs : rs[0];
};

function numToStr(num) {
    return `\\u${padStart(num.toString(16).toUpperCase(), 4, "0")}`;
}

function padStart(str, maxLength, fillStr) {
    return pad(str, maxLength, fillStr) + str;
}
function pad(str, maxLength, fillStr) {
    if (!Number.isInteger(maxLength)) {
        return "";
    }
    let stringLength = str.length;
    if (maxLength <= stringLength) {
        return "";
    }
    if (fillStr === undefined || fillStr === "") {
        fillStr = " ";
    }
    let padLen = maxLength - stringLength;
    let truncatedStringFiller = "";
    do {
        truncatedStringFiller += fillStr;
    } while (truncatedStringFiller.length < padLen);
    return truncatedStringFiller.slice(0, padLen);
}
