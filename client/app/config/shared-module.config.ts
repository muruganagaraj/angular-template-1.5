/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.config {
    appModule.config(
        /* @ngInject */
        (sharedConfigProvider: shared.config.SharedConfig) => {
            sharedConfigProvider.config.inputGroup.condition = '{control-name}.$invalid && {control-name}.$touched';
        }
    );
}