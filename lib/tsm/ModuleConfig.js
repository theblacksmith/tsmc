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
//# sourceMappingURL=moduleConfig.js.map
