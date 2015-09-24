/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BasePopupService {
        constructor(private $modal: angular.ui.bootstrap.IModalService,
                    private $window: angular.IWindowService) {
        }

        protected showWindow(url: string, width: number, height: number, options?: IWindowPopupOptions): void {
            let specs: string = `width=${width || 500},height=${height || 400}`;
            options = options || {};
            url += this.buildQueryParams(options.queryParams);
            if (options.scrollbars === undefined || options.scrollbars) {
                specs += `,scrollbars=1`;
            }
            let target: string = options.target || '_blank';
            this.$window.open(url, target, specs);
        }

        private buildQueryParams(queryParams: any): string {
            if (!queryParams) {
                return '';
            }
            let result: string = '';
            for (let p in queryParams) {
                if (queryParams.hasOwnProperty(p) && queryParams[p]) {
                    if (result.length > 0) {
                        result += '&';
                    }
                    result += `${p}=${encodeURI(queryParams[p])}`;
                }
            }
            return '?' + result;
        }

        protected showModal<T>(settings: angular.ui.bootstrap.IModalSettings): angular.IPromise<T> {
            return this.$modal.open(settings).result;
        }

        protected abstract getTemplateUrl(modalName: string): string;

        protected getModalSettings<TModalData extends IHtmlPopupData>(modalName: string, modalData: TModalData): angular.ui.bootstrap.IModalSettings {
            let size: string = modalData.size ? HtmlPopupSize[modalData.size] : HtmlPopupSize[HtmlPopupSize.Large];
            return {
                templateUrl: this.getTemplateUrl(modalName),
                controller: `${modalName.snakeCaseToCamelCase()}ModalController`,
                controllerAs: 'modal',
                backdrop: 'static',
                size: size,
                keyboard: false,
                resolve: {
                    data: (): TModalData => modalData
                }
            };
        }
    }

    export interface IWindowPopupOptions {
        queryParams?: any;
        target?: string;
        scrollbars?: boolean;
    }
}
