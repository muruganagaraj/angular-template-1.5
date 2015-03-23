/// <reference path="../../typings/tsd.d.ts" />
var main;
(function (main) {
    var MyService = (function () {
        function MyService() {
        }
        MyService.prototype.add = function (a, b) {
            return a + b;
        };
        return MyService;
    })();
    main.MyService = MyService;
})(main || (main = {}));
angular.module("app").factory("myService", function () {
    return new main.MyService();
});
//# sourceMappingURL=MyService.js.map