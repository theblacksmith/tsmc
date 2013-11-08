/// <reference path="../typings/colors.d.ts" />

class Docs {
  // @todo improve name to url conversion
  static link(page: string) {
    return name + " >> ".green + "https://github.com/theblacksmith/tsm/wiki/" + page.replace(' ', '-');
  }
}