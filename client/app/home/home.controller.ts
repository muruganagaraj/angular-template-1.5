/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.home {
    export class HomeController extends shared.bases.PageController<common.layouts.main.MainLayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope, private messagingService: shared.messaging.MessagingService) {
            super($scope, null);
            $scope.$on('$onMessageReceived', (event: angular.IAngularEvent, message: shared.messaging.IMessage) => {
                this.state = message.message;
                $scope.$apply();
            });
        }

        public items: TextPair[] = [
            { value: '001', text: 'Item 1'},
            { value: '002', text: 'Item 2'},
            { value: '003', text: 'Third Item'}
        ];

        public selectedItem: string;

        public firstName: string;
        public state: TextPair;

        public onSetStateClicked(): void {
            this.messagingService.send('test', { text: this.firstName, value: this.firstName });
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
