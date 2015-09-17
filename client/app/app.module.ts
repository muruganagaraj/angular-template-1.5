/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    export const moduleName: string = 'app';

    angular.module(moduleName, [
        /* App modules */
        app.common.moduleName,
        shared.moduleName,

        /* Angular modules */
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngAria',

        /* Angular-UI modules */
        'ui.router',
        'ui.bootstrap',
        'ui-grid',
        'ui.grid.autoResize',
        'ui.grid.expandable',
        'ui.grid.pagination',
        'ui.grid.pinning',
        'ui.grid.resizeColumns',
        'ui.grid.selection'
    ]);

    export const appModule: () => angular.IModule = () => angular.module(moduleName);

    export interface IConfig {
        apiBaseUrl: string;
    }
}
