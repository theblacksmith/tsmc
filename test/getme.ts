var path = require("path");
var fse = require("fs-extra");
var temp = require("temp");

temp.track();

class GetMe {
  static a_valid_config_file_at(path: string, overrides?: any) {
    throw new Error("Not implemented");
  }

  static a_path_to_a_dir_which_contains_a_package_config() {
    return path.resolve(path.join(__dirname, 'fixtures/pkgConfigured'));
  }

  static a_path_to_a_dir_which_contains_a_tsm_config() {
    return path.resolve(path.join(__dirname, 'fixtures/tsmConfigured'));
  }

  static the_abs_path_of(pathRelativeToTestRoot: string) {
    return path.resolve(path.join(__dirname, pathRelativeToTestRoot));
  }
  static a_valid_module_root() {
    return GetMe.the_abs_path_of('fixtures/aValidModule')
  }

  static an_empty_dir_path() {
    return GetMe.the_abs_path_of('fixtures/empty');
  }

  static a_file_which_references(refs: string[]) : string {
    var tmpDir = GetMe.the_abs_path_of('tmp');
    var file = temp.openSync({ dir: tmpDir }).path;

    var data = "";

    // @todo: generate references alternating quote type and other possible typing changes
    _.each(refs, function(ref) {
      data += "/// <reference path='"+ref+"' />\n";
    });

    fse.writeFileSync(file, data);

    return file;
  }
}

function getme<T>(what: string, ...args: any[]): T {
  var defName = what.toLowerCase().replace(/\s/g, '_');
  
  if(!_(GetMe).has(defName))
    throw new Error(_.f("GetMe doesn't know how to get you '%s'. " +
      " Add a definition in the GetMe class with the name '%s'", what, defName));

  return GetMe[defName].apply(null, args);
}