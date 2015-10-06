/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.home {
    export class HomeController extends shared.bases.PageController<common.layouts.main.MainLayoutController> {
        /* @ngInject */
        constructor($scope: IHomeControllerScope, private homePopupService: HomePopupService) {
            super($scope, null);
            console.log(this.layout.shell.input);
            if (Boolean(this.layout.shell.input)) {
                this.firstName = this.layout.shell.input;
            }
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
            this.homePopupService.showHomePopup(this.firstName);
        }

        public onButton2Clicked(): void {
            console.log(this.layout.shell.input);
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

    export class HomePopupService extends shared.bases.BasePopupService {
        /* @ngInject */
        constructor($modal: angular.ui.bootstrap.IModalService,
                    $window: angular.IWindowService,
                    storageService: shared.services.StorageService) {
            super($modal, $window, storageService);
        }
        public showHomePopup(name: string): void {
            this.showWindow('/', { input: name });
        }

        protected getTemplateUrl(modalName: string): string {
            return undefined;
        }
    }

    appModule.service('homePopupService', HomePopupService);
}
