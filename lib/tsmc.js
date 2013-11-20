var _ = require("underscore");
_.mixin(require("underscore.string"));

_.f = _.sprintf;
_.emptyFunc = function () {
};

if (typeof module === "object" && module.exports) {
    module.exports = _;
} else if (typeof define === "function" && define.amd) {
    define(function () {
        return _;
    });
}
var CompilationTarget;
(function (CompilationTarget) {
    CompilationTarget[CompilationTarget["ES3"] = 0] = "ES3";
    CompilationTarget[CompilationTarget["ES5"] = 1] = "ES5";
})(CompilationTarget || (CompilationTarget = {}));

var ModuleKind;
(function (ModuleKind) {
    ModuleKind[ModuleKind["AMD"] = 0] = "AMD";
    ModuleKind[ModuleKind["CommonJS"] = 1] = "CommonJS";
    ModuleKind[ModuleKind["None"] = 2] = "None";
})(ModuleKind || (ModuleKind = {}));

var CompilationOptions = (function () {
    function CompilationOptions(options) {
        _.extend(this, CompilationOptions.defaults, options || {});
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
        var _this = this;

        _.each(boolOptions, function (opt) {
            if (_this[opt])
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

        if (this.moduleKind != ModuleKind.None)
            args.push("--moduleKind " + (this.moduleKind == ModuleKind.AMD ? "amd" : "commonjs"));

        args.push("--target " + (this.target == CompilationTarget.ES3 ? "ES3" : "ES5"));

        return args.join(" ");
    };
    CompilationOptions.defaults = {
        allowbool: false,
        allowimportmodule: false,
        declaration: true,
        mapRoot: "",
        moduleKind: ModuleKind.None,
        noImplicitAny: false,
        noResolve: false,
        outDir: "",
        removeComments: false,
        sourcemap: true,
        sourceRoot: ""
    };
    return CompilationOptions;
})();
require("colors");

var Logger = (function () {
    function Logger() {
    }
    Logger.enableDebug = function () {
        Logger.debugEnabled = true;
    };

    Logger.disableDebug = function () {
        Logger.debugEnabled = false;
    };

    Logger.setVerboseOn = function () {
        Logger.verboseOutput = true;
    };

    Logger.setVerboseOff = function () {
        Logger.verboseOutput = false;
    };

    Logger.debug = function (title, msg) {
        if (!Logger.debugEnabled)
            return;

        if (msg)
            Logger.log(title.yellow + ' ' + msg);
else
            Logger.log(title.yellow);
    };

    Logger.verbose = function (title, msg) {
        if (Logger.verboseOutput) {
            if (msg)
                Logger.log(title.yellow + ' ' + msg);
else
                Logger.log(title);
        }
    };

    Logger.log = function (msg, padTimes) {
        if (typeof padTimes === "undefined") { padTimes = 0; }
        console.log(_.pad("", (Logger.pad_size * (padTimes + Logger.current_pad))) + msg);
    };

    Logger.warn = function (msg) {
        console.log("Warning: ".magenta + msg.magenta);
        process.exit(-1);
    };

    Logger.indent = function () {
        Logger.current_pad++;
    };

    Logger.unindent = function () {
        Logger.current_pad--;
    };

    Logger.skipLine = function () {
        Logger.log("");
    };

    Logger.logHeader = function (text) {
        Logger.log(text.underline);
    };

    Logger.logSubHeader = function (text) {
        Logger.log('>> '.green + text.white);
    };
    Logger.current_pad = 1;
    Logger.pad_size = 3;
    Logger.debugEnabled = false;
    Logger.verboseOutput = false;
    return Logger;
})();
var path = require("path");
var logger = Logger;
require("colors");

var ConfigFileType;
(function (ConfigFileType) {
    ConfigFileType[ConfigFileType["TSMC"] = 0] = "TSMC";
    ConfigFileType[ConfigFileType["PACKAGE"] = 1] = "PACKAGE";
})(ConfigFileType || (ConfigFileType = {}));

var ModuleConfig = (function () {
    function ModuleConfig(config, moduleRoot) {
        var config;

        if (_(config).isObject()) {
            config.moduleRoot = moduleRoot || config.moduleRoot;
        } else if (_(config).isString()) {
            var location = config;

            try  {
                var stat = fs.statSync(location);
                if (stat.isDirectory()) {
                    var ref = ModuleRef.factory(location);
                    location = ref.location;
                }
            } catch (e) {
                throw new Error(_.f("Invalid config path: %s", location));
            }

            try  {
                var config = JSON.parse(fs.readFileSync(location).toString());
            } catch (err) {
                throw new Error(_.f('The configuration at %s is invalid.\n Error parsing json: %s', location, err.message || err));
            }

            if (this.getConfigFormat(location) == ConfigFileType.PACKAGE) {
                if (!config.tsm)
                    throw new Error("When defining a module using a package.json file you need to add a tsm property.\n" + "For more info, see " + Docs.link("Defining a Module"));

                var pkg = config;
                config = config.tsm;
                config.name = config.name || pkg.name;
            }

            config.moduleRoot = path.resolve(path.dirname(location));
        } else {
        }

        var missingFields = [];

        if (!config.name)
            missingFields.push("name");

        if (!config.moduleRoot)
            missingFields.push("moduleRoot");

        if (missingFields.length > 0)
            throw new Error("The submodule's " + missingFields.join(" and ") + " cannot be empty");

        _.extend(this, ModuleConfig.defaults, config);

        if (!(this.options instanceof CompilationOptions))
            this.options = new CompilationOptions(this.options || {});

        if (_.isUndefined(this.options.out) || _.isNull(this.options.out))
            this.options.out = _.template(ModuleConfig.OUTPUT_FILENAME_PATTERN, { config: config, path: path });
    }
    Object.defineProperty(ModuleConfig.prototype, "compileTo", {
        get: function () {
            return this.options.out;
        },
        set: function (value) {
            this.options.out = value;
        },
        enumerable: true,
        configurable: true
    });


    ModuleConfig.prototype.getConfigFormat = function (path) {
        if (_(path).endsWith(".tsm"))
            return ConfigFileType.TSMC;

        if (_(path).endsWith(".json"))
            return ConfigFileType.PACKAGE;

        return null;
    };
    ModuleConfig.CONFIG_FILE_PATTERN = '{package.json,*.tsm}';

    ModuleConfig.OUTPUT_FILENAME_PATTERN = '<%= path.join(path.dirname(config.moduleRoot), config.name) %>.js';

    ModuleConfig.defaults = {
        name: "",
        src: ["**/*.ts", "!**/*.d.ts"],
        parentModuleName: "",
        dependencies: {}
    };
    return ModuleConfig;
})();
var Docs = (function () {
    function Docs() {
    }
    Docs.link = function (name, page) {
        if (arguments.length == 1)
            page = name;
        return name + " >> ".green + "https://github.com/theblacksmith/tsmc/wiki/" + page.replace(' ', '-');
    };
    return Docs;
})();
var fs = require("fs");
var glob = require("glob");
var minimatch = require("minimatch");
var path = require("path");

var ModuleRefType;
(function (ModuleRefType) {
    ModuleRefType[ModuleRefType["TSMC"] = 0] = "TSMC";
    ModuleRefType[ModuleRefType["PACKAGE"] = 1] = "PACKAGE";
})(ModuleRefType || (ModuleRefType = {}));

var ModuleRef = (function () {
    function ModuleRef(name, location, format) {
        this.name = name;
        this.location = location;
        this.format = format;
    }
    ModuleRef.factory = function (name, location, declaringModulePath) {
        var name, location;

        if (arguments.length == 1) {
            location = name;
        } else if (arguments.length == 2) {
            declaringModulePath = location;
            location = name;
        }

        var absLocation = ModuleRef.resolvePath(location, declaringModulePath);

        if (_.isArray(absLocation))
            throw new Error("Could not find a module at '" + location + "'. Tried paths: " + absLocation.join(", "));

        location = absLocation;

        try  {
            var stat = fs.statSync(location);

            if (stat.isDirectory()) {
                location = path.join(location, ModuleRef.findConfigFile(name, location));
            }

            var ref = new ModuleRef(name, location, _.endsWith(location, ".tsm") ? ModuleRefType.TSMC : ModuleRefType.PACKAGE);
        } catch (err) {
            var msg = _.f("The reference %s is invalid. %s", location, err.message || err);
            if (err.message)
                err.message = msg;
else
                err = msg;

            throw err;
        }

        if (!name) {
            var config = ref.load();
            ref.name = config.name;
        }

        return ref;
    };

    ModuleRef.findConfigFile = function (name, root) {
        var matches = glob.sync(ModuleConfig.CONFIG_FILE_PATTERN, { cwd: root });

        if (matches.length == 0)
            throw new Error("The path (" + root + ") does not contain a module definition file. See " + Docs.link("Defining a Module"));

        if (matches.length > 1)
            throw new Error("Multiple module definition files found at " + root + ": " + matches.join(", ") + " Please be more specific on the reference to " + name);

        return matches[0];
    };

    ModuleRef.resolvePath = function (location, declaringModulePath) {
        var tried = [];

        if (declaringModulePath) {
            var absLoc = path.resolve(declaringModulePath, location);

            tried.push(absLoc);

            if (fs.existsSync(absLoc))
                return absLoc;
        }

        absLoc = path.resolve(location);
        tried.push(absLoc);

        if (fs.existsSync(absLoc))
            return absLoc;

        return tried;
    };

    ModuleRef.prototype.load = function () {
        return new ModuleConfig(this.location);
    };
    return ModuleRef;
})();

if (typeof module === "object" && module.exports) {
    module.exports = ModuleRef;
} else if (typeof define === "function" && define.amd) {
    define(function () {
        return ModuleRef;
    });
}
var glob = require("glob");
var mm = require("minimatch");

var FileFinder = (function () {
    function FileFinder() {
    }
    FileFinder.findSync = function (pattern, options) {
        if (typeof pattern == 'string') {
            return glob.sync(pattern, options);
        }

        var nextPattern = pattern.shift();

        var result = glob.sync(nextPattern, options);

        while (result.length > 0 && (nextPattern = pattern.shift())) {
            result = result.filter(mm.filter(nextPattern));
        }

        return result;
    };
    return FileFinder;
})();

if (typeof module === "object" && module.exports) {
    module.exports = FileFinder;
} else if (typeof define === "function" && define.amd) {
    define(function () {
        return FileFinder;
    });
}
var path = require("path");
var tsc = require("typescript-compiler");
var logger = Logger;
var fse = require("fs-extra");
var temp = require("temp");

require("colors");

var Compiler = (function () {
    function Compiler(cwd) {
        if (typeof cwd === "undefined") { cwd = process.cwd(); }
        this.cwd = cwd;
        this.builtModules = {};
        this.filePattern = /package.json|.*\.tsm/;
    }
    Compiler.prototype.compile = function (tsmAny, onError) {
        this.builtModules = {};
        this._compile(tsmAny, onError, false);
    };

    Compiler.prototype._compile = function (tsmAny, onError, isSubmodule) {
        if (typeof isSubmodule === "undefined") { isSubmodule = false; }
        var tsmConfig, onError;
        var _this = this;

        onError = onError || _.emptyFunc;

        if (tsmAny instanceof ModuleConfig) {
            tsmConfig = tsmAny;
        } else if (tsmAny instanceof ModuleRef) {
            tsmConfig = (tsmAny).load();
        } else {
            tsmConfig = ModuleRef.factory(tsmAny).load();
        }

        var errorOcurred = false;

        if (!isSubmodule) {
            logger.verbose("");
            logger.log("Compiling module ".blue + tsmConfig.name + " at ".blue + tsmConfig.moduleRoot);
        }

        if (!_.isEmpty(tsmConfig.submodules))
            logger.verbose("Compiling submodules");

        _.each(tsmConfig.submodules, function (subm, name) {
            logger.indent();
            logger.verbose("");

            if (_(subm).isObject()) {
                subm.name = subm.name || name;
                subm.moduleRoot = path.join(tsmConfig.moduleRoot, subm.moduleRoot);

                submConfig = new ModuleConfig(subm, subm.moduleRoot);
            } else {
                var submPath = ModuleRef.resolvePath(subm, tsmConfig.moduleRoot);

                if (_(submPath).isArray())
                    throw _.f("Could not find module %s at %s. Tried paths: %s", name, subm, submPath.join(", "));

                var submConfig = ModuleRef.factory(name, submPath, tsmConfig.moduleRoot).load();
            }

            if (_this.builtModules[name]) {
                logger.verbose(("Referencing already built module " + name).green);
                return;
            }

            logger.log("Compiling submodule ".blue + name + " at ".blue + subm.moduleRoot);
            _this._compile(submConfig, onError, true);

            _this.builtModules[submConfig.name] = submConfig.options.out;

            logger.unindent();
        });

        if (!_.isEmpty(tsmConfig.submodules)) {
            logger.verbose("");
            logger.verbose("All submodules compiled".green);

            logger.verbose("");
            logger.verbose(("Back to compiling " + tsmConfig.name + " module").blue);
        }

        if (!_.isEmpty(tsmConfig.dependencies))
            logger.verbose("Resolving dependencies");

        _.each(tsmConfig.dependencies, function (dep, depName) {
            logger.indent();
            logger.verbose("");

            if (_(dep).isObject()) {
                throw "Invalid dependencies declaration. Dependencies must be defined in the form: 'dep.name': '../dep/path' ";
            } else {
                var depPath = ModuleRef.resolvePath(dep, tsmConfig.moduleRoot);

                if (_(depPath).isArray())
                    throw _.f("Could not find module %s at %s. Tried paths: %s", depName, dep, depPath.join(", "));
            }

            var depConfig = ModuleRef.factory(depName, depPath, tsmConfig.moduleRoot).load();

            if (!_this.builtModules[depConfig.name]) {
                logger.log("Compiling dependency ".blue + depName + " at ".blue + dep);
                _this._compile(depConfig, onError, true);
            } else
                logger.verbose(_.f("Dependency %s already built".green, depConfig.name));

            logger.unindent();
        });

        if (!_.isEmpty(tsmConfig.dependencies)) {
            logger.verbose("");
            logger.verbose("All dependencies resolved".green);

            logger.verbose("");
            logger.verbose(("Back to compiling " + tsmConfig.name + " module").blue);
        }

        logger.debug("Module root:", tsmConfig.moduleRoot);

        logger.debug("Finding files", JSON.stringify(tsmConfig.src) + " in ".yellow + tsmConfig.moduleRoot);
        var files = FileFinder.findSync(tsmConfig.src, { cwd: tsmConfig.moduleRoot });
        logger.debug("Files:", files.join(', '));

        logger.debug("Compiling to:", tsmConfig.options.out);

        var tscArgs = tsmConfig.options.toArgs();

        logger.verbose("Running tsc with options:", files.join(" ") + " " + tscArgs);

        var absFiles = _.map(files, function (f) {
            return path.join(tsmConfig.moduleRoot, f);
        });

        var previousCwd = process.cwd();
        process.chdir(tsmConfig.moduleRoot);

        tsc.compile(absFiles, tscArgs, function (str) {
            errorOcurred = true;
            onError(str);
        });

        process.chdir(previousCwd);

        if (!isSubmodule) {
            logger.log("\nGenerated files\n".blue);

            _.each(this.builtModules, function (file) {
                logger.log('>> '.green + file);
            });
            logger.log('>> '.green + tsmConfig.compileTo);
            logger.log("");
        }

        if (errorOcurred)
            logger.log("Done, with warnings.".red);
else
            logger.log("Done.".green);
    };

    Compiler.prototype.copyFilesToTmp = function (files) {
        var tmpDir = temp.mkdirSync();

        _.each(files, function (file) {
            fse.copySync(file, path.join(tmpDir, file));
        });

        return tmpDir;
    };

    Compiler.prototype.removeRefsFromFile = function (file, refs) {
        var contents = fs.readFileSync(file, { encoding: 'utf-8' });

        contents = contents.replace(new RegExp("///\\s*<reference\\s+.*(" + refs.join('|') + ").*", "g"), '');

        return contents;
    };
    return Compiler;
})();
require('source-map-support').install();
var colors = require('colors');

var TSMC = (function () {
    function TSMC() {
    }
    TSMC.compile = function (definitionFilePath) {
        var c = new Compiler(process.cwd());
        return c.compile(definitionFilePath);
    };

    TSMC.enableDebug = function () {
        Logger.enableDebug();
    };

    TSMC.setVerboseOn = function () {
        Logger.setVerboseOn();
    };
    return TSMC;
})();

if (typeof module === "object" && module.exports) {
    module.exports = TSMC;
} else if (typeof define === "function" && define.amd) {
    define(function () {
        return TSMC;
    });
}
