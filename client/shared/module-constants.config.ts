/// <reference path="../../typings/lib.d.ts" />
/// <reference path="../../typings/app.d.ts" />

namespace shared {
    sharedModule().constant('sharedConstants', <ISharedConstants>{
        componentPrefix: 'app',
        templateUrlRoot: '/client/shared/'
    });

    export interface ISharedConstants extends IConstants {
    }
}
