/// <reference path="../../typings/tsd.d.ts" />
var main;
(function (main) {
    var Item = (function () {
        function Item(content) {
            this.content = content;
            this.createdAt = new Date();
        }
        return Item;
    })();
    main.Item = Item;
})(main || (main = {}));
//# sourceMappingURL=Item.js.map