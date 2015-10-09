/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.home {
    import layout = layouts.sample;

    export class HomeController extends shared.bases.PageController<layout.LayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope) {
            super($scope, null);
        }
    }

    interface IHomeControllerScope extends shared.bases.IPageControllerScope<layout.LayoutController> {
    }

    export const route: IPageState = {
        name: 'home',
        layout: layout.route,
        templateUrl: 'home/home.html',
        url: '/'
    };

    registerController(HomeController, route);
}
