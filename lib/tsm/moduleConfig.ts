/// <reference path="../../typings/all.d.ts" />
/// <reference path="underscore-extd.ts" />
/// <reference path="compilationOptions.ts" />
/// <reference path="logger.ts" />

var path = require("path");
var logger = Logger;
require("colors");

enum ConfigFileType {
  TSM,
  PACKAGE
}

/**
 * @class ModuleConfig
 * @classdesc Holds the configuration for a TypeScript module.
 *
 * The module configuration include compilation options and meta information about a module
 */
class ModuleConfig
{
  /**
   * @member {string} ModuleConfig#name 
   * @summary The name of this module
   */
  name: string;

  /**
   * @member {string[]} ModuleConfig#src
   * @summary An array of Glob patterns (see [node-glob docs](https://github.com/isaacs/node-glob))
   * @default ["**\/*.ts", "!**\/*.d.ts"]
   */
  src: Array<string>;

  /**
   * @member {string} ModuleConfig#parentModuleName 
   * @summary The name of the parent module, when this module is a submodule
   * @default ""
   */
  parentModuleName: string;

  /**
   * @memberof ModuleConfig#
   * @member {object} submodules 
   * @summary The submodules this module contains
   * @default {}
   */
  submodules: any;
  
  /**
   * @member {object} ModuleConfig#dependencies 
   * @summary Other modules this module requires in order to be compiled
   * @default {}
   */
  dependencies: any;

  /**
   * @member {string} ModuleConfig#moduleRoot 
   * @summary A path to the directory which is this module's root
   * @default When a file is used to define the module, to the folder which contains the config file.
   */
  moduleRoot: string;

  /**
   * @member {CompilationOptions} ModuleConfig#options 
   * @summary Compilation options for tsc
   */
  options: CompilationOptions;

  /**
   * @member {string} ModuleConfig#compileTo
   * @summary The path of the file where to write the compilation output
   *
   * Returns the compiled file's name
   */
  get compileTo(): string {
    return this.options.out;
  }

  /**
   * Sets the compiled file's name
   */
  set compileTo(value: string) {
    this.options.out = value;
  }

  /**
   * A minimatch pattern which matches valid config files
   */
  static CONFIG_FILE_PATTERN = '{package.json,*.tsm}';

  /**
   * @member ModuleConfig.OUTPUT_FILENAME_PATTERN
   * @kind constant
   * @desc An underscore template used to generate the output filename when it is not expicitly set
   * @default '<%= path.join(path.dirname(config.moduleRoot), config.name) %>.js'
   */
  static OUTPUT_FILENAME_PATTERN = '<%= path.join(path.dirname(config.moduleRoot), config.name) %>.js';

  static defaults = {
    name: "",
    src: ["**/*.ts", "!**/*.d.ts"],
    parentModuleName: "",
    dependencies: {}
  };

  /**
   * @constructor ModuleConfig
   * @param {string} configPath The configuration file or parent directory path
   * @returns ModuleConfig
   */
  constructor(configPath: string);

  /**
   * @constructor ModuleConfig
   * @param {object} config     The module configuration
   * @param {string} moduleRoot The name of this module
   * @returns ModuleConfig
   */
  constructor(config: any, moduleRoot?: string);

  constructor(config: any, moduleRoot?: string) {
    var config: any;

    if(_(config).isObject()) {
      config.moduleRoot = moduleRoot || config.moduleRoot;
    }
    else if(_(config).isString())
    {
      var location: string = config;

      try {
        var stat = fs.statSync(location);
        if(stat.isDirectory()) {
          var ref = ModuleRef.factory(location);
          location = ref.location;
        }
      }
      catch(e) {
        throw new Error(_.f("Invalid config path: %s", location));
      }

      // load config from path
      try {
        var config = JSON.parse(fs.readFileSync(location).toString());
      }
      catch(err) {
        throw new Error(_.f('The configuration at %s is invalid.\n Error parsing json: %s', location, err.message || err));
      }

      if(this.getConfigFormat(location) == ConfigFileType.PACKAGE) {
        if (!config.tsm)
          throw new Error("When defining a module using a package.json file you need to add a tsm property.\n" +
                "For more info, see " + Docs.link("Defining a Module"));

        var pkg = config;
        config = config.tsm;
        config.name = config.name || pkg.name;
      }

      config.moduleRoot = path.resolve(path.dirname(location));
    }
    else {
      /*
      config = {
        name: name, 
        moduleRoot: moduleRoot,
        src: src || ModuleConfig.defaults.src,
        parentModuleName: parentModuleName || ModuleConfig.defaults.parentModuleName,
        submodules: submodules || {},
        dependencies: dependencies || ModuleConfig.defaults.dependencies,
        options: tscOptions
      };
      */
    }

    var missingFields = [];

    if (!config.name)
      missingFields.push("name");
    
    if(!config.moduleRoot)
      missingFields.push("moduleRoot");

    if(missingFields.length > 0)
      throw new Error("The submodule's " + missingFields.join(" and ") + " cannot be empty");

    _.extend(this, ModuleConfig.defaults, config);

    if(!(this.options instanceof CompilationOptions))
      this.options = new CompilationOptions(this.options || {});

    // we need to allow setting it to an empty string
    if(_.isUndefined(this.options.out) || _.isNull(this.options.out))
      this.options.out = _.template(ModuleConfig.OUTPUT_FILENAME_PATTERN, { config: config, path: path });
  }

  private getConfigFormat(path) {
    if(_(path).endsWith(".tsm"))
      return ConfigFileType.TSM;

    if(_(path).endsWith(".json"))
      return ConfigFileType.PACKAGE;

    return null;
  }
}