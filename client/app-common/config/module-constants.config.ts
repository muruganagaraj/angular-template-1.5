/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.common.config {
    appCommonModule.constant('appCommonConstants', <IAppCommonConstants>{
        templateUrlRoot: '/client/app-common/'
    });

    export interface IAppCommonConstants extends IConstants {
    }
}
