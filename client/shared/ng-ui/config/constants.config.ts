/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.ng.ui.config {
    sharedNgUiModule.constant('sharedNgUiConstants', <ISharedNgUiConstants>{
        templateUrlRoot: '/client/shared/ng-ui/'
    });

    export interface ISharedNgUiConstants extends IConstants {
    }
}
