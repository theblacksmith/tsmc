/// <reference path="../typings/node.d.ts" />
/// <reference path="TSModuleConfig.ts" />
/// <reference path="../docs.ts" />
var fs = require("fs");
var glob = require("glob");

var TSModuleRefType;
(function (TSModuleRefType) {
    TSModuleRefType[TSModuleRefType["TSM"] = 0] = "TSM";
    TSModuleRefType[TSModuleRefType["PACKAGE"] = 1] = "PACKAGE";
})(TSModuleRefType || (TSModuleRefType = {}));

var TSModuleRef = (function () {
    function TSModuleRef(name, location, format) {
        this.name = name;
        this.location = location;
        this.format = format;
    }
    TSModuleRef.factory = function () {
        var name, location;

        if (arguments.length == 1) {
            location = name;
            name = null;
        }

        try  {
            var stat = fs.statSync(location);

            if (stat.isDirectory()) {
                var matches = glob.sync(TSM.ConfigFileGlobPattern, { cwd: location });

                if (matches.length == 0)
                    throw "The path does not contain a module definition file. See " + Docs.link("Defining a Module");

                if (matches.length > 1)
                    throw "Multiple module definition files found: " + matches.join(", ") + " Please be more specific on the reference to " + name;

                location = matches[0];
            }

            var ref = new TSModuleRef(name, location, _.endsWith(location, ".tsm") ? TSModuleRefType.TSM : TSModuleRefType.PACKAGE);

            if (!name) {
                var config = ref.load();
                ref.name = config.name;
            }

            return ref;
        } catch (err) {
            var e = new Error("The reference location is invalid: " + err.message);
            (e).innerError = err;
            throw e;
        }
    };

    TSModuleRef.prototype.load = function () {
        var mod = JSON.parse(fs.readFileSync(this.location).toString());

        if (this.format == TSModuleRefType.PACKAGE) {
            if (!mod.tsm)
                throw "When defining a module using a package.json file you need to add a tsm property." + "For more info, see " + Docs.link("Defining a Module");

            var pkg = mod;
            mod = mod.tsm;
            mod.name = mod.name || pkg.name;
        }

        return mod;
    };
    return TSModuleRef;
})();
//# sourceMappingURL=TSModuleRef.js.map
