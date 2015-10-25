/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.config {
    appDemoModule.constant('appDemoConstants', <IAppDemoConstants>{
        templateUrlRoot: '/client/app-demo/'
    });

    export interface IAppDemoConstants extends IConstants {
    }
}
