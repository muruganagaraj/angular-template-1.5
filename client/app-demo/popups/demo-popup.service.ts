/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.popups {
    export class DemoPopupService extends shared.bases.BasePopupService {
        /* @ngInject */
        constructor($state: angular.ui.IStateService) {
            super($state);
        }

        public showFormsWindow(): void {
            this.showWindow(forms.route);
        }

        public showBingWindow(): void {
            this.showWindow('http://bing.com');
        }

        public showFormsWindowWithInputs(email: string): void {
            this.showWindow(forms.route, {
                input: { email: email }
            });
        }
    }

    appDemoModule.service('demoPopupService', DemoPopupService);
}
