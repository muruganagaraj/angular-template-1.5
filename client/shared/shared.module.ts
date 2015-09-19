/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace shared {
    angular.module('shared', []);

    export const sharedModule: () => angular.IModule = () => angular.module('shared');
}
