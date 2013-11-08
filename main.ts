/// <reference path="lib/typings.ts" />
/// <reference path="lib/tsm.d.ts" />

var TSM = require("./lib/tsm");

declare var module;
declare var define;

// see https://github.com/umdjs/umd
if (typeof module === "object" && module.exports) {
  // CommonJS (Node)
  module.exports = new TSM();
}
else if (typeof exports === "object") {
  // CommonJS (Node)
  exports = new TSM();
} else if (typeof define === "function" && define.amd) {
  // AMD
  define(function () { return new TSM(); });
}