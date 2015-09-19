/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    export const moduleName: string = 'app';

    angular.module(moduleName, [
        /* App modules */
        'app-common',
        'shared',

        /* Angular modules */
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngAria',

        /* Angular-UI modules */
        'ui.router',
        'ui.bootstrap'
    ]);

    export const appModule: () => angular.IModule = () => angular.module(moduleName);

    export interface IConfig {
        apiBaseUrl: string;
    }
}
