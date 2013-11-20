/// <reference path="../../typings/all.d.ts" />

var _ = require("underscore");
    _.mixin(require("underscore.string"));

 _.f = _.sprintf;
 _.emptyFunc = function(){};


declare var module;
declare var define;

// see https://github.com/umdjs/umd
if (typeof module === "object" && module.exports) {
  // CommonJS (Node)
  module.exports = _;
} else if (typeof define === "function" && define.amd) {
  // AMD
  define(function () { return _; });
}