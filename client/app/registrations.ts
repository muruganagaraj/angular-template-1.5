/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    export function registerController(
        controllerConstructor: Function,
        route: IExtendedState,
        ...secondaryRoutes: IExtendedState[]): angular.IModule {

        return registerControllers(controllerConstructor, route, secondaryRoutes, app.appModule(), 'appConstants');
    }
}
