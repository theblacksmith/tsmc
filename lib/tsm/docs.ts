/// <reference path="../../typings/all.d.ts" />

/**
 * @class Docs
 */
class Docs {
  // @todo improve name to url conversion
  static link(page: string);
  static link(name: string, page?: string) {
    if(arguments.length == 1)
      page = name;
    return name + " >> ".green + "https://github.com/theblacksmith/tsm/wiki/" + page.replace(' ', '-');
  }
}