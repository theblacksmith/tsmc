/// <reference path="../typings/colors.d.ts" />
var Docs = (function () {
    function Docs() {
    }
    Docs.link = // @todo improve name to url conversion
    function (page) {
        return name + " >> ".green + "https://github.com/theblacksmith/tsm/wiki/" + page.replace(' ', '-');
    };
    return Docs;
})();
//# sourceMappingURL=docs.js.map
