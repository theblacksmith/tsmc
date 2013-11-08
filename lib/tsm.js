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
/// <reference path="compilationOptions.ts" />
/**
* ModuleConfig holds the configuration for a TypeScript module
*
* The module configuration include compilation options and meta information about a module
*/
var ModuleConfig = (function () {
    /**
    * @constructs ModuleConfig
    */
    function ModuleConfig(name, src, parentModuleName, submodules, dependencies) {
        if (!name)
            throw "The submodule name cannot be empty";

        this.name = name;
        this.src = src || ["**/*.ts", "!**/*.d.ts"];
        this.parentModuleName = parentModuleName || "";
        this.submodules = submodules || {};
        this.dependencies = dependencies || {};
    }
    return ModuleConfig;
})();
/// <reference path="ModuleConfig.ts" />
var Module = (function () {
    function Module(config) {
        this.config = config;
    }
    return Module;
})();
/// <reference path="../typings/colors.d.ts" />
var Docs = (function () {
    function Docs() {
    }
    Docs.link = // @todo improve name to url conversion
    function (page) {
        return name + " >> ".green + "https://github.com/theblacksmith/tsm/wiki/" + page.replace(' ', '-');
    };
    return Docs;
})();
/// <reference path="../typings/node.d.ts" />
/// <reference path="moduleConfig.ts" />
/// <reference path="docs.ts" />
var fs = require("fs");
var glob = require("glob");

var ModuleRefType;
(function (ModuleRefType) {
    ModuleRefType[ModuleRefType["TSM"] = 0] = "TSM";
    ModuleRefType[ModuleRefType["PACKAGE"] = 1] = "PACKAGE";
})(ModuleRefType || (ModuleRefType = {}));

var ModuleRef = (function () {
    function ModuleRef(name, location, format) {
        this.name = name;
        this.location = location;
        this.format = format;
    }
    ModuleRef.factory = function () {
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

            var ref = new ModuleRef(name, location, _.endsWith(location, ".tsm") ? ModuleRefType.TSM : ModuleRefType.PACKAGE);

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

    ModuleRef.prototype.load = function () {
        var mod = JSON.parse(fs.readFileSync(this.location).toString());

        if (this.format == ModuleRefType.PACKAGE) {
            if (!mod.tsm)
                throw "When defining a module using a package.json file you need to add a tsm property." + "For more info, see " + Docs.link("Defining a Module");

            var pkg = mod;
            mod = mod.tsm;
            mod.name = mod.name || pkg.name;
        }

        return mod;
    };
    return ModuleRef;
})();
/// <reference path="../typings.ts" />
/// <reference path="module.ts" />
/// <reference path="moduleRef.ts" />
var path = require("path");
var _ = require("underscore");
var tsc = require("typescript-compiler");

var Compiler = (function () {
    function Compiler(cwd) {
        this.cwd = cwd;
        this.compiledModules = [];
        this.current_pad = 0;
        this.padSize = 3;
        this.filePattern = /package.json|.*\.tsm/;
    }
    Compiler.prototype.findSubmodule = function (submoduleRef) {
        return "";
    };

    Compiler.prototype.compileSubModule = function (ref, onError) {
        this.current_pad++;
        this.compile(ref, onError);
        this.current_pad--;
    };

    Compiler.prototype.compile = function () {
        var tsmConfig, modPath, onError;

        if (arguments.length == 3) {
            tsmConfig = arguments[0];
            modPath = arguments[1];
            onError = arguments[2];
        } else if (typeof arguments[0] == "object") {
            tsmConfig = (arguments[0]).load();
            modPath = path.resolve((arguments[0]).location);
            onError = arguments[1];
        } else {
            tsmConfig = ModuleRef.factory(arguments[0]).load();
            modPath = path.resolve(arguments[0]);
            onError = arguments[1];
        }

        onError = onError || function () {
            return void {};
        };

        var errorOcurred = false;

        logHeader(tsmConfig, modPath);

        /*
        _.each(tsm.dependencies, function(dep) {
        log("resolving dependency ".yellow + dep, 1);
        
        if(!compiledModules[dep]) {
        log("\n\n");
        throw "Couldn't find tsm definition for module " + dep;
        }
        
        if(!compiledModules[dep].built) {
        skipLine();
        compile(modules[dep], true);
        skipLine();
        }
        else
        log("...already built".green);
        });
        */
        var files = glob.sync(tsmConfig.src, { cwd: modPath });

        log("Module root: " + modPath);
        log("Files: " + files.join(', ').blue, 1);

        log("compiling module to " + path.join(modPath, tsmConfig.options.out), 1);

        tsc.compile(files, modPath + " " + tsmConfig.options.toArgs(), onError);

        if (errorOcurred)
            log("Done, with warnings.".red, 1);
else
            log("Done.".green, 1);

        return this.compiledModules;
    };
    return Compiler;
})();

//
// Private utility functions
//
function log(msg, padTimes) {
    return _.pad("", this.padSize * ((padTimes || 0) + this.current_pad));
}

function logHeader(mod, modPath) {
    log(("Compiling module " + mod.name + " (" + path.dirname(modPath) + ")\n").underline);
}

function logSubHeader(mod, modPath) {
    log('>> '.green + "Compiling module " + mod.name + " (" + path.dirname(modPath) + ")\n".white, 1);
}

function skipLine() {
    log("");
}
/// <reference path="typings.ts" />
/// <reference path="tsm/compiler.ts" />
var TSM = (function () {
    function TSM() {
    }
    TSM.prototype.compile = function (definitionFilePath) {
        var c = new Compiler(process.cwd());
        return c.compile(definitionFilePath);
    };
    TSM.ConfigFileGlobPattern = "{package.json,*.tsm}";
    return TSM;
})();

if (typeof module === "object" && module.exports) {
    // CommonJS (Node)
    module.exports = TSM;
} else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
        return TSM;
    });
}
