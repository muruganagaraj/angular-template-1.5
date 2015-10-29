/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app.demo {
    angular.module('app-demo', [
        'app-common',
        'shared',

        /* Angular modules */
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngAria',

        /* Angular-UI modules */
        'ui.router'
    ]);

    export const appDemoModule: angular.IModule = angular.module('app-demo');

    export function registerController(controllerConstructor: Function, route: IPageState, ...secondaryRoutes: IPageState[]): angular.IModule {
        return registerControllers(controllerConstructor, route, secondaryRoutes, app.demo.appDemoModule, 'appDemoConstants');
    }
    
    appDemoModule.constant('appDemoConstants', <IAppDemoConstants>{
        templateUrlRoot: '/client/app-demo/'
    });

    export interface IAppDemoConstants extends IConstants {
    }
}
