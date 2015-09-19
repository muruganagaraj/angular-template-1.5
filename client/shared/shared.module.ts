/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace shared {
    export const moduleName: string = 'shared';

    angular.module(moduleName, []);

    export const sharedModule: () => angular.IModule = () => angular.module(moduleName);
}
