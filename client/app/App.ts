/// <reference path="../typings/tsd.d.ts" />

angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap'
]);

angular.module('app')
    .config(['$routeProvider', '$locationProvider', ($routeProvider:ng.route.IRouteProvider, $locationProvider:ng.ILocationProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: '/app/main/main.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }
]);
