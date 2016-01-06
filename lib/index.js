"use strict";

const reCJKRange = require("./cjk-range-regexp");
const reHSR = /[\uD800-\uDBFF]/;
const reLSR = /[\uDC00-\uDFFF]/;

function trimLineEnding(state, silent) {
    let pos = state.pos;
    if (state.src.charCodeAt(pos) !== 0x0A/* \n */) {
        return false;
    }

    if (silent) {
        return false;
    }

    let pmax = state.pending.length - 1;
    let smax = pos + 1;

    let first = state.pending[pmax];
    if (reLSR.test(first) && reHSR.test(state.pending[pmax - 1])) {
        first = state.pending.slice(pmax - 1);
    }
    let next = state.src[smax];
    if (reHSR.test(next) && reLSR.test(state.src[smax + 1])) {
        next = state.src.slice(smax, smax + 2);
    }

    if (!reCJKRange.test(first) || !reCJKRange.test(next)) {
        return false;
    }

    pos += 1;
    state.pos = pos;
    return true;
}

module.exports = function removeLineEndingBetweenCJKCharactersPlugin(md) {
    md.inline.ruler.before("newline", "perfect-newline-for-cjk", trimLineEnding);
};
