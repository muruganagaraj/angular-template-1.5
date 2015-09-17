/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app {
    appModule().constant('appConstants', <IAppConstants>{
        componentPrefix: 'app',
        templateUrlRoot: '/client/app/'
    });

    export interface IAppConstants extends IConstants {
    }
}
