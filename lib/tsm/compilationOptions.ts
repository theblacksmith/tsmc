/// <reference path="../typings.ts" />

var _ = require("underscore");

enum CompilationTarget { ES3, ES5 }

enum ModuleKind { AMD, CommonJS }

class CompilationOptions {
  /**
   * Allow 'bool' as a synonym for 'boolean'
   * @default false
   **/
  allowbool: boolean;

  /**
   * Allow 'module(...)' as a synonym for 'require(...)'
   * @default false
   **/
  allowimportmodule: boolean;

  /**
   * Generates corresponding .d.ts file
   * @default true
   **/
  declaration: boolean;

  /**
   * Specifies the location where debugger should locate map files instead of generated locations.
   **/
  mapRoot: string;

  /** Specify module code generation: ModuleKind.CommonJS or ModuleKind.AMD **/
  moduleKind: ModuleKind;

  /** Warn on expressions and declarations with an implied 'any' type. **/
  noImplicitAny: boolean;

  /**
   * Skip resolution and preprocessing
   * @default false
   **/
  noResolve: boolean;

  /**
   * Concatenate and emit output to single file.
   * @default [ModuleConfig#parentModuleName]{@linkcode parentModuleName}-[ModuleConfig#name]{@linkcode name}.d.ts
   **/
  out: string;

  /**
   * Redirect output structure to the directory specified
   *
   * NOTE: In TSM, you can specify both outDir and out. In that case every module compiled 
   * will be put in outDir directory but respecting the out option name
   * 
   */
  outDir: string;

  /**
   * Do not emit comments to output
   * @default false
   **/
  removeComments: boolean;

  /**
   * Generates corresponding .map file
   * @default true
   */
  sourcemap: boolean;

  /**
   *  Specifies the location where debugger should locate TypeScript files instead of source locations.
   */
  sourceRoot: string;

  /**
   * Specify ECMAScript target version: CompilationTarget.ES3 or CompilationTarget.ES5
   * @default CompilationTarget.ES5
   */
  target: CompilationTarget;

  constructor(options: {}) {
    _.extend(this, {
      declaration: true,
      sourcemap: true,
      target: CompilationTarget.ES5
    }, options);
  }

  public toArgs(): string {
    var args = [];
    var boolOptions = ["allowbool", "allowimportmodule", "declaration",
                      "noImplicitAny", "noResolve", "removeComments", "sourcemap"];

    _.each(boolOptions, function (opt) {
      if (this[opt]) args.push("--" + opt);
    });

    if (this.mapRoot.trim()) args.push("--mapRoot " + this.mapRoot);

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

    // always add
    args.push("--moduleKind " + (this.moduleKind == ModuleKind.AMD ? "amd" : "commonjs"));
    args.push("--target " + (this.target == CompilationTarget.ES3 ? "ES3" : "ES5"));

    return args.join(" ");
  }
}