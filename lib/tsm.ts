/// <reference path="../typings/all.d.ts" />
/// <reference path="tsm/compiler.ts" />

/**
 * @module tsm
 * @tutorial quick-start
 */

require('source-map-support').install();
var colors = require('colors');

/**
 * @class TSM
 */
class TSM {

  static compile(definitionFilePath) {
    var c = new Compiler(process.cwd());
    return c.compile(definitionFilePath);
  }

  static enableDebug() {
    Logger.enableDebug();
  }

  static setVerboseOn() {
    Logger.setVerboseOn();
  }
}

declare var module;
declare var define;

// see https://github.com/umdjs/umd
if (typeof module === "object" && module.exports) {
  // CommonJS (Node)
  module.exports = TSM;
} else if (typeof define === "function" && define.amd) {
  // AMD
  define(function () { return TSM; });
}