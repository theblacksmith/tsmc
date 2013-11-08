/// <reference path="ModuleConfig.ts" />

class Module
{
  name: string;
  parentModuleName: string;
  path: string;
  submodules: Array<Module>;
  dependencies: Array<Module>;

  constructor(public config: Module) {
  }
}