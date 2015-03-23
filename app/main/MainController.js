var main;
(function (main) {
    var MainController = (function () {
        function MainController($scope) {
            this.$scope = $scope;
            $scope.items = [];
            $scope.add = function (item) {
                $scope.items.push(new main.Item(item));
            };
        }
        MainController.$inject = ['$scope'];
        return MainController;
    })();
    main.MainController = MainController;
})(main || (main = {}));
angular.module('app').controller("MainController", main.MainController);
//# sourceMappingURL=MainController.js.map