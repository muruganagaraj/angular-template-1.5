/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.popups {
    export class DemoPopupService extends shared.bases.BasePopupService {
        /* @ngInject */
        constructor(private $state: angular.ui.IStateService) {
            super();
        }

        public showFormsWindow(): void {
            this.showWindow(this.$state.href(forms.route));
        }
    }

    appDemoModule.service('demoPopupService', DemoPopupService);
}
