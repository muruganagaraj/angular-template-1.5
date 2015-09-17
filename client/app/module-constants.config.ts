/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    appModule().constant('appConstants', <IAppConstants>{
        templateUrlRoot: '/client/app/',
        componentPrefix: 'app'
    });

    export interface IAppConstants extends IConstants {
    }
}
