module main {
    export interface MainScope extends ng.IScope {
        content: string;
        items: Item[];
        add(item: string): void;
    }

    export class MainController {
        static $inject = ['$scope'];

        constructor(private $scope:: MainScope) {
            $scope.items = [];
            $scope.add = (item: string): void => {
                $scope.items.push(new main.Item(item));
            }
        }
    }
}

angular.module('app').controller("MainController", main.MainController);
