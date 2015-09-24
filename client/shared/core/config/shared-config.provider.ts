/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.config {
    export class SharedConfig implements angular.IServiceProvider {
        private _config: ISharedConfig = {
            enableIf: {
                editableElements: ['INPUT'],
                enableableElements: ['BUTTON']
            },
            inputGroup: {
                condition: '{control-name}.$invalid'
            }
        };

        public $get(): ISharedConfig {
            return this._config;
        }

        public get config(): ISharedConfig {
            return this._config;
        }
    }

    sharedModule.provider('sharedConfig', SharedConfig);

    export interface ISharedConfig {
        enableIf: {
            editableElements: string[];
            enableableElements: string[];
        };
        inputGroup: {
            condition: string;
        };
    }
}
