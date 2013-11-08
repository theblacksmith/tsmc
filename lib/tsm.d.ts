/// <reference path="typings/colors.d.ts" />
/// <reference path="typings/node.d.ts" />
declare var _;
declare enum CompilationTarget {
    ES3,
    ES5,
}
declare enum ModuleKind {
    AMD,
    CommonJS,
}
declare class CompilationOptions {
    /**
    * Allow 'bool' as a synonym for 'boolean'
    * @default false
    **/
    public allowbool: boolean;
    /**
    * Allow 'module(...)' as a synonym for 'require(...)'
    * @default false
    **/
    public allowimportmodule: boolean;
    /**
    * Generates corresponding .d.ts file
    * @default true
    **/
    public declaration: boolean;
    /**
    * Specifies the location where debugger should locate map files instead of generated locations.
    **/
    public mapRoot: string;
    /** Specify module code generation: ModuleKind.CommonJS or ModuleKind.AMD **/
    public moduleKind: ModuleKind;
    /** Warn on expressions and declarations with an implied 'any' type. **/
    public noImplicitAny: boolean;
    /**
    * Skip resolution and preprocessing
    * @default false
    **/
    public noResolve: boolean;
    /**
    * Concatenate and emit output to single file.
    * @default [ModuleConfig#parentModuleName]{@linkcode parentModuleName}-[ModuleConfig#name]{@linkcode name}.d.ts
    **/
    public out: string;
    /**
    * Redirect output structure to the directory specified
    *
    * NOTE: In TSM, you can specify both outDir and out. In that case every module compiled
    * will be put in outDir directory but respecting the out option name
    *
    */
    public outDir: string;
    /**
    * Do not emit comments to output
    * @default false
    **/
    public removeComments: boolean;
    /**
    * Generates corresponding .map file
    * @default true
    */
    public sourcemap: boolean;
    /**
    *  Specifies the location where debugger should locate TypeScript files instead of source locations.
    */
    public sourceRoot: string;
    /**
    * Specify ECMAScript target version: CompilationTarget.ES3 or CompilationTarget.ES5
    * @default CompilationTarget.ES5
    */
    public target: CompilationTarget;
    constructor(options: {});
    public toArgs(): string;
}
/**
* ModuleConfig holds the configuration for a TypeScript module
*
* The module configuration include compilation options and meta information about a module
*/
declare class ModuleConfig {
    /**
    * The name of this module
    */
    public name: string;
    /**
    * An array of Glob patterns (see https://github.com/isaacs/node-glob)
    *
    * @default ["**\/*.ts", "!**\/*.d.ts"]
    */
    public src: string[];
    /**
    * The name of the parent module, when this module is a submodule
    *
    * @default ""
    */
    public parentModuleName: string;
    /**
    * The submodules this module contains
    *
    * @default {}
    */
    public submodules: any;
    /**
    * Other modules this module requires in order to be compiled
    *
    * @default {}
    */
    public dependencies: any;
    public options: CompilationOptions;
    /**
    * @constructs ModuleConfig
    */
    constructor(name: string, src?: string[], parentModuleName?: string, submodules?: {}, dependencies?: {});
}
declare class Module {
    public config: Module;
    public name: string;
    public parentModuleName: string;
    public path: string;
    public submodules: Module[];
    public dependencies: Module[];
    constructor(config: Module);
}
declare class Docs {
    static link(page: string): string;
}
declare var fs;
declare var glob;
declare enum ModuleRefType {
    TSM,
    PACKAGE,
}
declare class ModuleRef {
    public name: string;
    public location: string;
    public format: ModuleRefType;
    constructor(name: string, location: string, format: ModuleRefType);
    static factory(location: string);
    static factory(name: string, location: string);
    public load(): ModuleConfig;
}
declare var path;
declare var _;
declare var tsc;
declare class Compiler {
    public cwd: string;
    public filePattern;
    private compiledModules;
    private current_pad;
    private padSize;
    constructor(cwd: string);
    public findSubmodule(submoduleRef: string): string;
    public compileSubModule(ref: ModuleRef, onError?: (error: string) => void): void;
    public compile(tsmPath: string, onError?: (error: string) => void);
    public compile(tsmRef: ModuleRef, onError?: (error: string) => void);
    public compile(tsmConfig: ModuleConfig, modPath: string, onError?: (error: string) => void);
}
declare function log(msg: string, padTimes?: number);
declare function logHeader(mod: ModuleConfig, modPath: string): void;
declare function logSubHeader(mod: ModuleConfig, modPath: string): void;
declare function skipLine(): void;
declare class TSM {
    static ConfigFileGlobPattern: string;
    public compile(definitionFilePath);
}
