/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.popups {
    import layout = layouts.sample;

    export class PopupsController extends shared.bases.PageController<layout.LayoutController> {
        /* @ngInject */
        constructor($scope: IPopupsControllerScope,
                    private popupService: shared.popups.PopupService,
                    private demoPopupService: DemoPopupService) {
            super($scope, null);
        }

        public onConfirmClicked(): void {
            this.popupService.showConfirmation(`This is a confirmation modal. Please confirm whether you want to proceed or not.`, 'Confirm', 'Proceed', `Don't proceed`);
        }

        public onInfoAlertClicked(): void {
            this.popupService.showInfo(`This is an information alert.`, 'Info Alert');
        }

        public onWarningAlertClicked(): void {
            this.popupService.showWarning(`This is a warning alert.`, 'Warning Alert');
        }

        public onErrorAlertClicked(): void {
            this.popupService.showError(`This is an error alert.`, 'Error Alert');
        }

        public onWindowPopupClicked(): void {
            this.demoPopupService.showFormsWindow();
        }

        public onBingPopupClicked(): void {
            this.demoPopupService.showBingWindow();
        }

        public email: string;

        public onWindowPopupInputsClicked(): void {
            this.demoPopupService.showFormsWindowWithInputs(this.email);
        }
    }

    export interface IPopupsControllerScope extends shared.bases.IPageControllerScope<layout.LayoutController> {
    }

    export const route: IPageState = {
        name: 'popups',
        layout: layout.route,
        templateUrl: 'popups/popups.html',
        url: '/demos/popups',
        title: 'Popups Demo'
    };

    registerController(PopupsController, route);
}
