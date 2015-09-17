/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BaseModalPopupController<TModalData extends IHtmlPopupData, TSuccess> {
        constructor(public $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
                    public data: TModalData) {
        }

        public ok(): void {
            let result: TSuccess = this.getSuccessResult();
            if (result) {
                this.$modalInstance.close(result);
            } else {
                this.$modalInstance.close();
            }
        }

        public cancel(): void {
            this.$modalInstance.dismiss();
        }

        protected getSuccessResult(): TSuccess {
            return undefined;
        }
    }

    export interface IHtmlPopupData {
        title: string;
        okTitle?: string;
        cancelTitle?: string;
        size?: HtmlPopupSize;
    }

    export enum HtmlPopupSize {
        Small,
        Large
    }
}
