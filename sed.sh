#!/bin/sh
# replacing `import` statement with plain `require` to jsbi we already have in root folder
sed -i 's/import JSBI from \".\/jsbi.mjs\"/const JSBI = require(\"..\/jsbi-cjs.js\")/' dist/*.js 