/// <reference path="../../../../../typings/lib.d.ts" />
/// <reference path="../../../../../typings/app.d.ts" />

namespace shared.popups.confirmModal {
    export class ConfirmModalController extends bases.BaseModalPopupController<IConfirmModalData, boolean> {
        /* @ngInject */
        constructor($uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    data: IConfirmModalData) {
            super($uibModalInstance, data);
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
