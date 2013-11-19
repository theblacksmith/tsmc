/// <reference path="../../typings/all.d.ts" />
/// <reference path="moduleRef.ts" />
/// <reference path="underscore-extd.ts" />
/// <reference path="fileFinder.ts" />
/// <reference path="logger.ts" />

var path = require("path");
var tsc = require("typescript-compiler");
var logger = Logger;
var fse = require("fs-extra");
var temp = require("temp");

require("colors");

/**
 * Compiler onError callback
 * @callback Compiler~onError
 * @param {string} error
 */

/**
 * @class Compiler
 */
class Compiler
{
  public filePattern;

  private builtModules = {};

  /**
   * @constructor Compiler
   * @param {string} [cwd=process.cwd()] - The working directory
   * @return Compiler
   */
  constructor(public cwd: string = process.cwd()) {
    this.filePattern = /package.json|.*\.tsm/;
  }

  /**
   * @method Compiler#compile
   * @param {string} tsmPath
   * @param {Compiler~onError} onError A callback function with the signature (error: string)
   */
  compile(tsmPath: string, onError?: (error: string) => void);

  /**
   * @method Compiler#compile
   * @param {ModuleRef} tsmRef
   * @param {Compiler~onError} onError A callback function with the signature (error: string)
   */
  compile(tsmRef: ModuleRef, onError?: (error: string) => void);

  /**
   * @method Compiler#compile
   * @param {ModuleConfig} tsmConfig
   * @param {Compiler~onError} onError A callback function with the signature (error: string)
   */
  compile(tsmConfig: ModuleConfig, onError?: (error: string) => void);
  compile(tsmAny: any, onError?: (error: string) => void) {
    this.builtModules = {};
    this._compile(tsmAny, onError, false);
  }

  private _compile(tsmAny: any, onError?: (error: string) => void, isSubmodule: boolean = false) {
    var tsmConfig : ModuleConfig, onError: (error: string) => void;
    var _this = this;

    onError = onError || _.emptyFunc;

    if (tsmAny instanceof ModuleConfig) {
      tsmConfig = <ModuleConfig>tsmAny;
    }
    else if (tsmAny instanceof ModuleRef) {
      tsmConfig = (<ModuleRef>tsmAny).load();
    }
    else {
      tsmConfig = ModuleRef.factory(tsmAny).load();
    }

    var errorOcurred = false;

    if(!isSubmodule) {
      logger.verbose("");
      logger.log("Compiling module ".blue + tsmConfig.name + " at ".blue + tsmConfig.moduleRoot);
    }

    if(!_.isEmpty(tsmConfig.submodules))
      logger.verbose("Compiling submodules");

    _.each(tsmConfig.submodules, function(subm, name) {
      logger.indent();
      logger.verbose("");
      
      if(_(subm).isObject()) {
        subm.name = subm.name || name;
        subm.moduleRoot = path.join(tsmConfig.moduleRoot, subm.moduleRoot);
        
        submConfig = new ModuleConfig(subm, subm.moduleRoot);
      }
      else {
        var submPath = ModuleRef.resolvePath(subm, tsmConfig.moduleRoot);

        if(_(submPath).isArray())
          throw _.f("Could not find module %s at %s. Tried paths: %s", name, subm, submPath.join(", "));

        var submConfig = ModuleRef.factory(name, submPath, tsmConfig.moduleRoot).load();
      }

      if(_this.builtModules[name]) {
        logger.verbose(("Referencing already built module " + name).green);
        return;
      }

      logger.log("Compiling submodule ".blue + name + " at ".blue + subm.moduleRoot);
      _this._compile(submConfig, onError, true);

      _this.builtModules[submConfig.name] = submConfig.options.out;

      logger.unindent();
    });

    if(!_.isEmpty(tsmConfig.submodules)) {
      logger.verbose("");
      logger.verbose("All submodules compiled".green);
      
      logger.verbose("");
      logger.verbose(("Back to compiling " + tsmConfig.name + " module").blue);
    }

    if(!_.isEmpty(tsmConfig.dependencies))
      logger.verbose("Resolving dependencies");

    _.each(tsmConfig.dependencies, function(dep, depName) {
      logger.indent();
      logger.verbose("");
        
      if(_(dep).isObject()) {
        throw "Invalid dependencies declaration. Dependencies must be defined in the form: 'dep.name': '../dep/path' ";
      }
      else
      {
        var depPath = ModuleRef.resolvePath(dep, tsmConfig.moduleRoot);

        if(_(depPath).isArray())
          throw _.f("Could not find module %s at %s. Tried paths: %s", depName, dep, depPath.join(", "));
      }
      
      var depConfig = ModuleRef.factory(depName, depPath, tsmConfig.moduleRoot).load();

      if(!_this.builtModules[depConfig.name]) {
        logger.log("Compiling dependency ".blue + depName + " at ".blue + dep);
        _this._compile(depConfig, onError, true);
      }
      else
        logger.verbose(_.f("Dependency %s already built".green, depConfig.name));

      logger.unindent();
    });

    if(!_.isEmpty(tsmConfig.dependencies)) {
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
    
    var absFiles = _.map(files, function(f) { return path.join(tsmConfig.moduleRoot,f); });
    
    var previousCwd = process.cwd();
    process.chdir(tsmConfig.moduleRoot);

    tsc.compile(absFiles, tscArgs, function(str) { errorOcurred = true; onError(str); });

    process.chdir(previousCwd);

    if(!isSubmodule) {
      logger.log("\nGenerated files\n".blue);

      _.each(this.builtModules, function(file) {
        logger.log('>> '.green + file);
      });
      logger.log('>> '.green + tsmConfig.compileTo);
      logger.log("");
    }

    if (errorOcurred)
      logger.log("Done, with warnings.".red);
    else
      logger.log("Done.".green);
  }

  /**
   * @returns The path to the new directory which contains the copied files
   */
  copyFilesToTmp(files: string[]): string {
    var tmpDir = temp.mkdirSync();

    _.each(files, function(file) {
      fse.copySync(file, path.join(tmpDir, file));
    });

    return tmpDir;
  }

  /**
   * @method Compiler#removeRefsFromFile
   * @todo The idea is to remove the references to submodules when compiling the supermodule
   * The Problem: We can't actually modify the source files.
   * First idea: Copy them to another place and modify the copies.
   *    But, it isn't as simple as that because references in source to files outside the module are usually relative
   *    So we need to either replace the relative references with absolute ones.
   */
  removeRefsFromFile(file: string, refs: string[]): string {
    var contents = fs.readFileSync(file, { encoding: 'utf-8' });

    contents = contents.replace(new RegExp("///\\s*<reference\\s+.*("+refs.join('|')+").*", "g"), '');

    return contents;
  }
}