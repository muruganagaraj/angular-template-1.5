/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app.common {
    export function registerController(
        controllerConstructor: Function,
        route: IExtendedState,
        ...secondaryRoutes: IExtendedState[]): angular.IModule {
        return registerControllers(controllerConstructor, route, secondaryRoutes, app.common.appCommonModule(), 'appCommonConstants');
    }
}
