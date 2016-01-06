# markdown-it-perfect-newline-for-cjk

[![Build Status](https://img.shields.io/travis/zbinlin/markdown-it-perfect-newline-for-cjk/master.svg?style=flat)](https://travis-ci.org/zbinlin/markdown-it-perfect-newline-for-cjk)
[![NPM version](https://img.shields.io/npm/v/markdown-it-perfect-newline-for-cjk.svg?style=flat)](https://www.npmjs.org/package/markdown-it-perfect-newline-for-cjk)
[![Coverage Status](https://img.shields.io/coveralls/zbinlin/markdown-it-perfect-newline-for-cjk/master.svg?style=flat)](https://coveralls.io/r/zbinlin/markdown-it-perfect-newline-for-cjk?branch=master)

> Remove line ending (LF) between CJK characters


## Install

node.js:

```bash
npm install markdown-it-perfect-newline-for-cjk --save
```


## Usage

```js
let md = require("markdown-it")();
md.use(require("markdown-it-perfect-newline-for-cjk"));
md.render(`这不是一个
换行！`); // => "<p>这不是一个换行！</p>"
```
