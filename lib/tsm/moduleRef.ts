/// <reference path="../typings/node.d.ts" />
/// <reference path="moduleConfig.ts" />
/// <reference path="docs.ts" />

var fs = require("fs");
var glob = require("glob");

enum ModuleRefType {
  TSM,
  PACKAGE
}

class ModuleRef {

  constructor(
    public name: string,
    public location: string,
    public format: ModuleRefType) {
  }

  static factory(location: string);
  static factory(name: string, location: string)
  static factory(): ModuleRef {
    var name, location;

    if(arguments.length == 1)
    {
      location = name;
      name = null;
    }

    try {
      var stat = fs.statSync(location);

      if(stat.isDirectory()) {
        var matches = glob.sync(TSM.ConfigFileGlobPattern, { cwd: location });

        if(matches.length == 0)
          throw "The path does not contain a module definition file. See " + Docs.link("Defining a Module")

        // @todo: improve this by checking the contents of the files.
        // e.g.: if a package.json and a [name].tsm where found, 
        if(matches.length > 1)
          throw "Multiple module definition files found: " + matches.join(", ") +
                " Please be more specific on the reference to " + name;

        location = matches[0];
      }

      var ref = new ModuleRef(name, location, _.endsWith(location, ".tsm") ? ModuleRefType.TSM : ModuleRefType.PACKAGE);

      if(!name)
      {
        var config = ref.load();
        ref.name = config.name;
      }

      return ref;
    }
    catch(err)
    {
      var e = new Error("The reference location is invalid: " + err.message);
      (<any>e).innerError = err;
      throw e;
    }
  }

  load(): ModuleConfig {
    var mod = JSON.parse(fs.readFileSync(this.location).toString());

    if(this.format == ModuleRefType.PACKAGE) {
      if (!mod.tsm)
        throw "When defining a module using a package.json file you need to add a tsm property." +
              "For more info, see " + Docs.link("Defining a Module")

      var pkg = mod;
      mod = mod.tsm;
      mod.name = mod.name || pkg.name;
    }

    return <ModuleConfig>mod;
  }
}