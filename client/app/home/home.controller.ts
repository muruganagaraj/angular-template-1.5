/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.home {
    export class HomeController extends shared.bases.PageController<common.layouts.main.MainLayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope) {
            super($scope, null);
        }
    }

    interface IHomeControllerScope extends shared.bases.IPageControllerScope<common.layouts.main.MainLayoutController> {
    }

    export const route: IExtendedState = {
        name: 'home',
        parent: common.layouts.main.route,
        templateUrl: 'home/home.html',
        url: '/'
    };

    registerController(HomeController, route);
}
