/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.popups.confirmModal {
    export class ConfirmModalController extends bases.BaseModalPopupController<IConfirmModalData, boolean> {
        /* @ngInject */
        constructor($modalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    data: IConfirmModalData) {
            super($modalInstance, data);
        }

        protected getSuccessResult(): boolean {
            return true;
        }
    }

    export interface IConfirmModalData extends bases.IHtmlPopupData {
        messages: string[];
    }

    sharedModule.controller('confirmModalController', ConfirmModalController);
}
