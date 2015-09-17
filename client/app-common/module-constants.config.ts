/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace app.common {
    appCommonModule().constant('appCommonConstants', <IAppCommonConstants>{
        componentPrefix: 'app',
        templateUrlRoot: '/client/app-common/'
    });

    export interface IAppCommonConstants extends IConstants {
    }
}
