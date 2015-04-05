/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap'
]);

angular.module('app')
    .config(['$routeProvider', '$locationProvider', ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: '/client/app/main/main.html'
            })
            .when('/other', {
                templateUrl: '/client/app/other/other.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);
