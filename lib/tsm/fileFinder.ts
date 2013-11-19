/// <reference path="../../typings/all.d.ts" />

var glob = require("glob");
var mm = require("minimatch");

class FileFinder
{
  static findSync(pattern: string, options: any);
  static findSync(pattern: Array<string>, options: any);
  static findSync(pattern: any, options: any) {
    if(typeof pattern == 'string') {
      return glob.sync(pattern, options);
    }

    var nextPattern = pattern.shift();

    var result = glob.sync(nextPattern, options);

    while(result.length > 0 && (nextPattern = pattern.shift()))
    {
      result = result.filter(mm.filter(nextPattern));
    }

    return result;
  }
}

declare var module;
declare var define;

// see https://github.com/umdjs/umd
if (typeof module === "object" && module.exports) {
  // CommonJS (Node)
  module.exports = FileFinder;
} else if (typeof define === "function" && define.amd) {
  // AMD
  define(function () { return FileFinder; });
}