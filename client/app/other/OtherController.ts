/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module main {
    export class OtherController {
        static $inject = ['$scope', '$location'];

        constructor(private $scope: ng.IScope) {
        }
    }
}

angular.module('app').controller("OtherController", main.OtherController);
