/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.config {
    appModule().constant('appConstants', <IAppConstants>{
        templateUrlRoot: '/client/app/'
    });

    export interface IAppConstants extends IConstants {
    }
}
