/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.popups {
    const confirmTitle: string = 'Confirm';
    const yesButtonTitle: string = 'Yes';
    const noButtonTitle: string = 'No';

    const errorTitle: string = 'Error';
    const infoTitle: string = 'Information';
    const warnTitle: string = 'Warning';
    const okButtonTitle: string = 'OK';

    export class PopupService extends bases.BasePopupService {
        /* @ngInject */
        constructor($state: angular.ui.IStateService, private sharedConstants: config.ISharedConstants) {
            super($state);
        }

        public showConfirmation(message: string|string[], title: string = confirmTitle, okTitle: string = yesButtonTitle, cancelTitle: string = noButtonTitle): angular.IPromise<boolean> {
            let messages: string[] = typeof message === 'string' ? [message] : message;
            let modalSettings: angular.ui.bootstrap.IModalSettings = this.getModalSettings('confirm', {
                title: title,
                okTitle: okTitle,
                cancelTitle: cancelTitle,
                size: bases.HtmlPopupSize.Large,
                messages: messages
            });
            return this.showModal(modalSettings);
        }

        public showError(message: string|string[], title: string = errorTitle, okTitle: string = okButtonTitle): angular.IPromise<boolean> {
            return this.showAlert(message, title, okTitle, alertModal.AlertType.danger);
        }

        public showInfo(message: string|string[], title: string = infoTitle, okTitle: string = okButtonTitle): angular.IPromise<boolean> {
            return this.showAlert(message, title, okTitle, alertModal.AlertType.info);
        }

        public showWarning(message: string|string[], title: string = warnTitle, okTitle: string = okButtonTitle): angular.IPromise<boolean> {
            return this.showAlert(message, title, okTitle, alertModal.AlertType.warning);
        }

        private showAlert(message: string|string[], title: string, okTitle: string, alertType: alertModal.AlertType): angular.IPromise<boolean> {
            let messages: string[] = typeof message === 'string' ? [message] : message;
            let modalSettings: angular.ui.bootstrap.IModalSettings = this.getModalSettings('alert', {
                title: title,
                messages: messages,
                okTitle: okTitle,
                alertType: alertModal.AlertType[alertType]
            });
            return this.showModal(modalSettings);
        }

        protected getTemplateUrl(modalName: string): string {
            return `${this.sharedConstants.templateUrlRoot}popups/${modalName}-modal/${modalName}-modal.html`;
        }
    }

    sharedModule.service('popupService', PopupService);
}
