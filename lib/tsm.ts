/// <reference path="typings.ts" />
/// <reference path="tsm/compiler.ts" />

class TSM {
  static ConfigFileGlobPattern = "{package.json,*.tsm}";

  compile(definitionFilePath) {
    var c = new Compiler(process.cwd());
    return c.compile(definitionFilePath);
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