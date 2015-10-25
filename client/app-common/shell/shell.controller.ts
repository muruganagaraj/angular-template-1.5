/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.common.shell {
    export class ShellController extends shared.bases.BaseShellController {
        /* @ngInject */
        constructor($injector: angular.auto.IInjectorService) {
            super($injector, null);
        }
    }

    appCommonModule.controller('shellController', ShellController);
}
