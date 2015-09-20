/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.config {
    export interface ISharedConfig {
        editableElements: string[];
        enableableElements: string[];
    }

    export class SharedConfig implements angular.IServiceProvider {
        //HTML elements that can be made editable/read-only using the enable-if directive
        private _editableElements: string[] = ['INPUT'];

        //HTML elements that can be enabled/disabled using the enable-if directive
        private _enableableElements: string[] = ['BUTTON'];

        public $get(): ISharedConfig {
            let result: ISharedConfig = {
                editableElements: this._editableElements,
                enableableElements: this._enableableElements
            };
            return result;
        }

        public get editableElements(): string[] {
            return this._editableElements;
        }

        public get enableableElements(): string[] {
            return this._enableableElements;
        }
    }

    sharedModule.provider('sharedConfig', SharedConfig);
}
