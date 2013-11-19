/// <reference path="../../typings/all.d.ts" />
/// <reference path="moduleConfig.ts" />
/// <reference path="docs.ts" />
/// <reference path="underscore-extd.ts" />

var fs = require("fs");
var glob = require("glob");
var minimatch = require("minimatch");
var path = require("path");

enum ModuleRefType {
  TSM,
  PACKAGE
}

/**
 * @class ModuleRef
 */
class ModuleRef {

  constructor(
    public name: string,
    public location: string,
    public format: ModuleRefType) {
  }

  /**
   * Creates a ModuleRef instance
   * @memberof ModuleRef#
   * @kind function
   * @param {string} location A path to the referenced module
   * @param {string} [optional] declaringModulePath A path to the module declaring the reference
   */
  static factory(location: string): ModuleRef;

  /**
   * Creates a ModuleRef instance
   * @memberof ModuleRef#
   * @kind function
   * @param {string} location A path to the referenced module
   * @param {string} [optional] declaringModulePath A path to the module declaring the reference
   */
  static factory(location: string, declaringModulePath?: string): ModuleRef;

  /**
   * Creates a ModuleRef instance
   * @memberof ModuleRef#
   * @kind function
   * @param {string} name The name of the referenced module
   * @param {string} location A path to the referenced module
   * @param {string} declaringModulePath A path to the module declaring the reference
   */
  static factory(name: string, location?: string, declaringModulePath?: string): ModuleRef;
  
  static factory(name: string, location?: string, declaringModulePath?: string): ModuleRef {
    var name, location;

    if(arguments.length == 1)
    {
      location = name;
    }
    else if(arguments.length == 2)
    {
      declaringModulePath = location;
      location = name;
    }

    var absLocation = ModuleRef.resolvePath(location, declaringModulePath);

    if(_.isArray(absLocation))
      throw new Error("Could not find a module at '"+location+"'. Tried paths: " + absLocation.join(", "))

    location = absLocation;

    try {
      var stat = fs.statSync(location);

      if(stat.isDirectory()) {
        location = path.join(location, ModuleRef.findConfigFile(name, location));
      }

      var ref = new ModuleRef(name, location, _.endsWith(location, ".tsm") ? ModuleRefType.TSM : ModuleRefType.PACKAGE);
    }
    catch(err)
    {
      var msg = _.f("The reference %s is invalid. %s", location, err.message || err);
      if(err.message)
        err.message = msg;
      else
        err = msg;
      
      throw err;
    }
    
    if(!name)
    {
      var config = ref.load();
      ref.name = config.name;
    }

    return ref;
  }

  private static findConfigFile(name: string, root: string) : string
  {
    var matches = glob.sync(ModuleConfig.CONFIG_FILE_PATTERN, { cwd: root });

    if(matches.length == 0)
      throw new Error("The path (" + root + ") does not contain a module definition file. See " + Docs.link("Defining a Module"));

    // @todo: improve this by checking the contents of the files.
    // e.g.: if a package.json and a [name].tsm where found, 
    if(matches.length > 1)
      throw new Error("Multiple module definition files found at " + root + ": " + matches.join(", ") +
            " Please be more specific on the reference to " + name);

    return matches[0];
  }

  /**
   * Tries to find the absolute path of a module's location using first the declaringModulePath
   * and then the current working directory.
   * @returns a string, when the module is found; or an array of attempted paths when it's not
   */
  static resolvePath(location: string, declaringModulePath?: string) {
    // trying to resolve from declaring module's path
    var tried = [];
    
    if(declaringModulePath) {
      var absLoc = path.resolve(declaringModulePath, location);
    
      tried.push(absLoc);

      if(fs.existsSync(absLoc))
        return absLoc;
    }

    // trying to resolve using current working dir
    absLoc = path.resolve(location);
    tried.push(absLoc);

    if(fs.existsSync(absLoc))
      return absLoc;

    // couldn't find it
    return tried;
  }

  load(): ModuleConfig {
    return new ModuleConfig(this.location);
  }
}

declare var module;
declare var define;

// see https://github.com/umdjs/umd
if (typeof module === "object" && module.exports) {
  // CommonJS (Node)
  module.exports = ModuleRef;
} else if (typeof define === "function" && define.amd) {
  // AMD
  define(function () { return ModuleRef; });
}