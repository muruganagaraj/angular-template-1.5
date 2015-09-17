/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app.common {
    export const moduleName: string = 'app-common';

    angular.module(moduleName, [shared.moduleName]);

    export const appCommonModule: () => angular.IModule = () => angular.module(moduleName);
}
