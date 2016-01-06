"use strict";

/* eslint-env mocha */

const MarkdownIt = require("markdown-it");
const path = require("path");
const generate = require("markdown-it-testgen");

describe("./index-test.js", function () {
    let md = new MarkdownIt();
    md.use(require(".."));
    generate(path.join(__dirname, "fixtures/index.txt"), md);
});
