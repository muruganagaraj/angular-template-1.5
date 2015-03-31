/// <reference path="../typings/tsd.d.ts" />
angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap'
]);
angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/app/main/main.html'
    }).otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}]);
//# sourceMappingURL=App.js.map