/// <reference path="typings.ts" />
/// <reference path="meta/TSModule.ts" />
/// <reference path="meta/TSModuleRef.ts" />
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

    Compiler.prototype.compileSubModule = function (ref) {
        this.current_pad++;
        this.compile(ref);
        this.current_pad--;
    };

    Compiler.prototype.compile = function () {
        var tsmConfig;
        var modPath;

        if (arguments.length == 2) {
            tsmConfig = arguments[0];
            modPath = arguments[1];
        } else if (typeof arguments[0] == "object") {
            tsmConfig = (arguments[0]).load();
            modPath = path.resolve((arguments[0]).location);
        } else {
            modPath = path.resolve(arguments[0]);
            tsmConfig = TSModuleRef.factory(arguments[0]).load();
        }

        var errorOcurred = false;

        logHeader(tsmConfig);

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

        log("compiling module to " + path.join(modPath, tsmConfig.out || tsmConfig.name + '.js'), 1);

        tsc.compile(files, ['--noLib', '--outDir', path.join('build', modPath), '--declaration', '--target', 'ES5', '--sourcemap'], function (error) {
            this.log.warn("warned");
            this.errors.push(error);
            errorOcurred = true;
            return false;
        });

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

function logHeader(tsmod) {
    log(("Compiling module " + tsmod.name + " (" + path.dirname(tsmod.path) + ")\n").underline);
}

function logSubHeader(tsmod) {
    log('>> '.green + "Compiling module " + tsmod.name + " (" + path.dirname(tsmod.path) + ")\n".white, 1);
}

function skipLine() {
    log("");
}
//# sourceMappingURL=compiler.js.map
