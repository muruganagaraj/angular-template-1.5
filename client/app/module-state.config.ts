/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    appModule().config(
        /* @ngInject */
        ($locationProvider: angular.ILocationProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise('/');
        }
    );

    appModule().run(
        /* @ngInject */
        ($rootScope: angular.IRootScopeService) => {
            $rootScope.$on('$stateChangeError', (event: angular.IAngularEvent, toState: IExtendedState, toParams: any, fromState: IExtendedState, fromParams: any, error: string) => {
                console.error(`State change error: ${error} (${typeof error})`);
                console.error(toState);
                if (Boolean(toParams)) {
                    console.error(toParams);
                }
                console.error(fromState);
                if (Boolean(fromParams)) {
                    console.error(fromParams);
                }
            });
            $rootScope.$on('$stateNotFound', (event: angular.IAngularEvent, unfoundState: IExtendedState, fromState: IExtendedState, fromParams: any) => {
                console.error(`State not found`);
                console.error(unfoundState);
            });
        }
    );
}