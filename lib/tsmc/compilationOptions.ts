/// <reference path="../../typings/all.d.ts" />

enum CompilationTarget { ES3, ES5 }

enum ModuleKind { AMD, CommonJS, None }

class CompilationOptions {
  /**
   * @member CompilationOptions#allowbool
   * @summary Allow 'bool' as a synonym for 'boolean'
   * @default false
   **/
  allowbool: boolean;

  /**
   * @member CompilationOptions#allowimportmodule
   * @summary Allow 'module(...)' as a synonym for 'require(...)'
   * @default false
   **/
  allowimportmodule: boolean;

  /**
   * @member CompilationOptions#declaration
   * @summary Generates corresponding .d.ts file
   * @default true
   **/
  declaration: boolean;

  /**
   * @member CompilationOptions#mapRoot
   * @summary Specifies the location where debugger should locate map files instead of generated locations.
   **/
  mapRoot: string;

  /** 
   * @member CompilationOptions#moduleKind
   * @summary Specify module code generation: ModuleKind.CommonJS, ModuleKind.AMD, ModuleKind.None
   * @default ModuleKind.None
   **/
  moduleKind: ModuleKind;

  /**
   * @member CompilationOptions#noResolve
   * @summary Warn on expressions and declarations with an implied 'any' type.
   * @default false
   **/
  noImplicitAny: boolean;

  /**
   * @member CompilationOptions#
   * @summary Skip resolution and preprocessing
   * @default false
   **/
  noResolve: boolean;

  /**
   * @member CompilationOptions#out
   * @summary Concatenate and emit output to single file.
   *
   * If none is specified, ModuleConfig will set it to 
   * [ModuleConfig#parentModuleName]{@linkcode parentModuleName}-[ModuleConfig#name]{@linkcode name}.ts
   *
   * @default [ModuleConfig#parentModuleName]{@linkcode parentModuleName}-[ModuleConfig#name]{@linkcode name}.ts
   **/
  out: string;

  /**
   * @member CompilationOptions#outDir
   * @summary Redirect output structure to the directory specified
   *
   * NOTE: In TSMC, you can specify both outDir and out. In that case every module compiled 
   * will be put in outDir directory but respecting the out option name
   */
  outDir: string;

  /**
   * @member CompilationOptions#removeComments
   * @summary Do not emit comments to output
   * @default false
   **/
  removeComments: boolean;

  /**
   * @member CompilationOptions#sourcemap
   * @summary Generates corresponding .map file
   * @default true
   */
  sourcemap: boolean;

  /**
   * @member CompilationOptions#sourceRoot
   * @summary Specifies the location where debugger should locate TypeScript files instead of source locations.
   */
  sourceRoot: string;

  /**
   * @member CompilationOptions#target
   * @summary Specify ECMAScript target version: CompilationTarget.ES3 or CompilationTarget.ES5
   * @default CompilationTarget.ES5
   */
  target: CompilationTarget;

  static defaults = {
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

  /**
   * @constructor CompilationOptions
   * @return CompilationOptions
   */

  /**
   * @constructor CompilationOptions
   * @param {object} options A hash of property values to be set.
   * @return CompilationOptions
   */
  constructor(options?: any) {
    _.extend(this, CompilationOptions.defaults, options || {});
  }

  public toArgs(): string {
    var args = [];
    var boolOptions = ["allowbool", "allowimportmodule", "declaration",
                      "noImplicitAny", "noResolve", "removeComments", "sourcemap"];
    var _this = this;
    
    _.each(boolOptions, function (opt) {
      if (_this[opt]) args.push("--" + opt);
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
    if(this.moduleKind != ModuleKind.None)
      args.push("--moduleKind " + (this.moduleKind == ModuleKind.AMD ? "amd" : "commonjs"));

    args.push("--target " + (this.target == CompilationTarget.ES3 ? "ES3" : "ES5"));

    return args.join(" ");
  }
}