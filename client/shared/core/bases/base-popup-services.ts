/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BasePopupService {
        constructor(private $modal: angular.ui.bootstrap.IModalService,
                    private $window: angular.IWindowService,
                    private messagingService: messaging.MessagingService) {
        }

        protected showWindow(url: string, options?: IWindowPopupOptions): void {
            options = options || {};
            let specs: string = `width=${options.width || 500},height=${options.height || 400}`;
            let inputs: IWindowInput = undefined;
            if (Boolean(options.input)) {
                inputs = {
                    windowId: this.getUniqueWindowId(),
                    input: options.input
                };
                if (!options.queryParams) {
                    options.queryParams = {};
                }
                options.queryParams.__u = inputs.windowId;
            }
            url += this.buildQueryParams(options.queryParams);
            if (options.scrollbars === undefined || options.scrollbars) {
                specs += `,scrollbars=1`;
            }
            let target: string = options.target || '_blank';
            this.$window.open(url, target, specs);
            if (Boolean(inputs)) {
                this.messagingService.send('$windowInput', inputs);
            }
        }

        private getUniqueWindowId(): string {
            let generator: () => string = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            return `w${generator()}${generator()}`;
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
        width?: number;
        height?: number;
        queryParams?: any;
        input?: any;
        target?: string;
        scrollbars?: boolean;
    }

    export interface IWindowInput {
        windowId: string;
        input: any;
    }
}
