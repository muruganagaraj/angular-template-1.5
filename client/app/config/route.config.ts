/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.config {
    appModule.config(
        /* @ngInject */
        ($locationProvider: angular.ILocationProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/');
        }
    );
}
