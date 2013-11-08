define(["require", "exports"], function(require, exports) {
    /// <reference path="typings.ts" />
    /// <reference path="compiler.ts" />
    /// <reference path="meta/TSModule.ts" />
    exports.ConfigFileGlobPattern = TSM.ConfigFileGlobPattern;

    function compile(definitionFilePath, options) {
        var c = new Compiler(options.cwd || process.cwd());
        return c.compile(definitionFilePath);
    }
    exports.compile = compile;
});
//# sourceMappingURL=main.js.map
