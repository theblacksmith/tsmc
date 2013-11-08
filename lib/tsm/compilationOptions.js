/// <reference path="../typings.ts" />
var _ = require("underscore");

var CompilationTarget;
(function (CompilationTarget) {
    CompilationTarget[CompilationTarget["ES3"] = 0] = "ES3";
    CompilationTarget[CompilationTarget["ES5"] = 1] = "ES5";
})(CompilationTarget || (CompilationTarget = {}));

var ModuleKind;
(function (ModuleKind) {
    ModuleKind[ModuleKind["AMD"] = 0] = "AMD";
    ModuleKind[ModuleKind["CommonJS"] = 1] = "CommonJS";
})(ModuleKind || (ModuleKind = {}));

var CompilationOptions = (function () {
    function CompilationOptions(options) {
        _.extend(this, {
            declaration: true,
            sourcemap: true,
            target: CompilationTarget.ES5
        }, options);
    }
    CompilationOptions.prototype.toArgs = function () {
        var args = [];
        var boolOptions = [
            "allowbool",
            "allowimportmodule",
            "declaration",
            "noImplicitAny",
            "noResolve",
            "removeComments",
            "sourcemap"
        ];

        _.each(boolOptions, function (opt) {
            if (this[opt])
                args.push("--" + opt);
        });

        if (this.mapRoot.trim())
            args.push("--mapRoot " + this.mapRoot);

        if (this.outDir.trim() && this.out.trim())
            args.push("--out " + path.join(this.outDir, this.out));
else {
            if (this.out.trim())
                args.push("--out " + this.out);
else if (this.outDir.trim())
                args.push("--outDir " + this.outDir);
        }

        if (this.sourceRoot.trim())
            args.push("--sourceRoot " + this.outDir);

        // always add
        args.push("--moduleKind " + (this.moduleKind == ModuleKind.AMD ? "amd" : "commonjs"));
        args.push("--target " + (this.target == CompilationTarget.ES3 ? "ES3" : "ES5"));

        return args.join(" ");
    };
    return CompilationOptions;
})();
//# sourceMappingURL=compilationOptions.js.map
