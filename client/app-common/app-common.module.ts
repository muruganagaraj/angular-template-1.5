/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app.common {
    angular.module('app-common', [
        'shared',

        /* Angular modules */
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngAria',

        /* Angular-UI modules */
        'ui.router'
    ]);

    export const appCommonModule: angular.IModule = angular.module('app-common');

    export function registerController(
        controllerConstructor: Function,
        route: IPageState,
        ...secondaryRoutes: IPageState[]): angular.IModule {
        return registerControllers(controllerConstructor, route, secondaryRoutes, app.common.appCommonModule, 'appCommonConstants');
    }
}
