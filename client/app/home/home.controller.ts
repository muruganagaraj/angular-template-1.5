/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.home {
    export class HomeController extends shared.bases.PageController<common.layouts.main.MainLayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope, private homeState: HomeState) {
            super($scope, null);
        }

        public items: TextPair[] = [
            { value: '001', text: 'Item 1'},
            { value: '002', text: 'Item 2'},
            { value: '003', text: 'Third Item'}
        ];

        public selectedItem: string;

        public firstName: string;
        public state: any;

        public onSetStateClicked() {
            this.homeState.myState = { text: 'Jeevan', value: '100' };
        }

        public onGetStateClicked() {
            this.state = this.homeState.myState;
        }
    }

    interface IHomeControllerScope extends shared.bases.IPageControllerScope<common.layouts.main.MainLayoutController> {
    }

    export const route: IPageState = {
        name: 'home',
        parent: common.layouts.main.route,
        templateUrl: 'home/home.html',
        url: '/'
    };

    registerController(HomeController, route);

    export class HomeState extends shared.bases.BaseState {
        constructor() {
            super([
                { name: 'myState', type: shared.bases.StateType.persisted }
            ]);
        }

        public get myState(): TextPair {
            return this.getState<TextPair>('myState');
        }

        public set myState(value: TextPair) {
            this.setState<TextPair>('myState', value);
        }
    }

    appModule.service('homeState', HomeState);
}
