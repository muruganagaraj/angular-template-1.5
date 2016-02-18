/// <reference path="../../../../../typings/lib.d.ts" />
/// <reference path="../../../../../typings/app.d.ts" />

namespace shared.popups.alertModal {
    export class AlertModalController extends bases.BaseModalPopupController<IAlertModalData, boolean> {
        /* @ngInject */
        constructor($uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    data: IAlertModalData) {
            super($uibModalInstance, data);
        }

        protected getSuccessResult(): boolean {
            return true;
        }
    }

    export interface IAlertModalData extends bases.IHtmlPopupData {
        messages: string[];
        alertType: AlertType;
    }

    export enum AlertType {
        info,
        warning,
        danger
    }

    sharedModule.controller('alertModalController', AlertModalController);
}
