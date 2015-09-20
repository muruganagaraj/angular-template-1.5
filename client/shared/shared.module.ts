/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace shared {
    angular.module('shared', []);

    export const sharedModule: angular.IModule = angular.module('shared');

    export function registerController(
        controllerConstructor: Function,
        route: IExtendedState,
        ...secondaryRoutes: IExtendedState[]): angular.IModule {
        return registerControllers(controllerConstructor, route, secondaryRoutes, shared.sharedModule, 'sharedConstants');
    }
}
