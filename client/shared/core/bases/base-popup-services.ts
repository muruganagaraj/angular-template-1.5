/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.bases {
    export const windowInputKey: (id: string) => string = (id: string) => `$window-input-${id}`;

    export abstract class BasePopupService {
        private $modal: angular.ui.bootstrap.IModalService;
        private $window: angular.IWindowService;
        private storageService: services.StorageService;
        protected sharedConfig: config.ISharedConfig;

        constructor() {
            let injector: angular.auto.IInjectorService = angular.injector(['ng', 'ui.bootstrap', 'shared']);
            this.$modal = injector.get<angular.ui.bootstrap.IModalService>('$modal');
            this.$window = injector.get<angular.IWindowService>('$window');
            this.storageService = injector.get<services.StorageService>('storageService');
            this.sharedConfig = injector.get<config.ISharedConfig>('sharedConfig');
        }

        protected showWindow(url: string, options?: IWindowPopupOptions): void {
            //TODO: Try using state instead of URL to navigate. Or provide an overload.
            options = options || {};
            let height: number = options.height || this.sharedConfig.popups.windowDefaults.height || 400;
            let width: number = options.width || this.sharedConfig.popups.windowDefaults.width || 500;
            let specs: string = `width=${width},height=${height}`;
            let windowId: string;
            if (Boolean(options.input)) {
                windowId = this.getUniqueWindowId();
                if (!options.queryParams) {
                    options.queryParams = {};
                }
                options.queryParams.__u = windowId;
            }
            url += this.buildQueryParams(options.queryParams);
            if (options.scrollbars === undefined || options.scrollbars) {
                specs += `,scrollbars=1`;
            }
            let target: string = options.target || '_blank';
            if (Boolean(windowId)) {
                this.storageService.setLocal(windowInputKey(windowId), options.input);
            }
            this.$window.open(url, target, specs);
        }

        private getUniqueWindowId(): string {
            let generator: () => string = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            return `${generator()}${generator()}`;
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
}
