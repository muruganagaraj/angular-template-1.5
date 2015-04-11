/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/app.d.ts" />

angular.module('app', [
    'ui.router',
    'ngSanitize',
    'ui.bootstrap'
]);

angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        (stateProvider: ng.ui.IStateProvider, urlRouterProvider: ng.ui.IUrlRouterProvider, locationProvider: ng.ILocationProvider) => {
        stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/client/app/main/main.html'
            })
            .state('other', {
                url: '/other',
                templateUrl: '/client/app/other/other.html'
            });
            locationProvider.html5Mode(true);
    }]);

//.config(['$routeProvider', '$locationProvider', ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
//    $routeProvider
//        .when('/', {
//            templateUrl: '/client/app/main/main.html'
//        })
//        .when('/other', {
//            templateUrl: '/client/app/other/other.html'
//        })
//        .otherwise({
//            redirectTo: '/'
//        });
//    $locationProvider.html5Mode(true);
//}]);

interface IConfig {
    apiUrl: string;
}
