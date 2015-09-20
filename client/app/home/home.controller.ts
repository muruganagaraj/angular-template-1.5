/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.home {
    export class HomeController extends shared.bases.PageController<common.layouts.main.MainLayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope) {
            super($scope, null);
        }

        public items: TextPair[] = [
            { value: '001', text: 'Item 1'},
            { value: '002', text: 'Item 2'},
            { value: '003', text: 'Item 3'}
        ];

        public selectedItem: string;

        public firstName: string;
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
