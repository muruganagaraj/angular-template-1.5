/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.config {
    appModule.constant('appConstants', <IAppConstants>{
        templateUrlRoot: '/client/app/'
    });

    /**
     * Well-known constants for the app module.
     */
    export interface IAppConstants extends IConstants {
    }
}
