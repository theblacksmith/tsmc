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
//# sourceMappingURL=compiler.js.map
