/// <reference path="compilationOptions.ts" />

/**
 * ModuleConfig holds the configuration for a TypeScript module
 *
 * The module configuration include compilation options and meta information about a module
 */

class ModuleConfig {
  /**
   * The name of this module
   */
  name: string;

  /**
   * An array of Glob patterns (see https://github.com/isaacs/node-glob)
   * 
   * @default ["**\/*.ts", "!**\/*.d.ts"]
   */
  src: Array<string>;

  /**
   * The name of the parent module, when this module is a submodule
   * 
   * @default ""
   */
  parentModuleName: string;

  /**
   * The submodules this module contains
   *
   * @default {}
   */
  submodules: any;
  
  /**
   * Other modules this module requires in order to be compiled
   * 
   * @default {}
   */
  dependencies: any;

  options: CompilationOptions;

  /**
   * @constructs ModuleConfig
   */
  constructor(name: string, src?: Array<string>, parentModuleName?: string, submodules?: {}, dependencies?: {}) {
    if (!name)
      throw "The submodule name cannot be empty";

    this.name = name;
    this.src = src || ["**/*.ts", "!**/*.d.ts"];
    this.parentModuleName = parentModuleName || "";
    this.submodules = submodules || {};
    this.dependencies = dependencies || {};
  }
}