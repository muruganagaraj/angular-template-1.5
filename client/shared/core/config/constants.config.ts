/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.config {
    sharedModule.constant('sharedConstants', <ISharedConstants>{
        templateUrlRoot: '/client/shared/core/'
    });

    export interface ISharedConstants extends IConstants {
    }
}
