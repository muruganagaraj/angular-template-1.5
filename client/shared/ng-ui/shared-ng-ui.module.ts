/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.ng.ui {
    angular.module('shared-ng-ui', []);

    export const sharedNgUiModule: angular.IModule = angular.module('shared-ng-ui');

    export function registerController(controllerConstructor: Function, route: IPageState, ...secondaryRoutes: IPageState[]): angular.IModule {
        return registerControllers(controllerConstructor, route, secondaryRoutes, shared.ng.ui.sharedNgUiModule, 'sharedNgUiConstants');
    }
}
