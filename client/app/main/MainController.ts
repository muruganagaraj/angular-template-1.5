/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module main {
    export interface MainScope extends ng.IScope {
        content: string;
        items: Item[];
        add(item: string): void;
        navigate(): void;
    }

    export class MainController {
        static $inject = ['$scope', '$location'];

        constructor(private $scope: MainScope, private location: ng.ILocationService) {
            $scope.items = [];
            $scope.add = (item: string): void => {
                $scope.items.push(new main.Item(item));
            };
            $scope.navigate = (): void => {
                location.path('/other');
            }
        }
    }
}

angular.module('app').controller("MainController", main.MainController);
