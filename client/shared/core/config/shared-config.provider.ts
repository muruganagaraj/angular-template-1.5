/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.config {
    export class SharedConfig implements angular.IServiceProvider {
        private _config: ISharedConfig = {
            dropdownWidgets: {
                singleSelectBuilder: null,
                multiSelectBuilder: null
            },
            enableIf: {
                editableElements: ['INPUT'],
                enableableElements: ['BUTTON']
            },
            forms: {
                errorCondition: '{control-name}.$invalid'
            },
            messaging: {
                messagePrefix: 'msg-'
            },
            popups: {
                windowDefaults: {
                    height: 400,
                    width: 500
                }
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
        dropdownWidgets: {
            //Function to build a single select dropdown DOM. If not specified, a HTML select element is used.
            singleSelectBuilder: (attrs: widgets.IDropdownWidgetAttributes) => JQuery;
            //Function to build a multi-select dropdown DOM. If not specified, a list is used.
            multiSelectBuilder: (attrs: widgets.IDropdownWidgetAttributes) => JQuery;
        };
        enableIf: {
            //HTML elements that are editable and hence can be made read-only.
            editableElements: string[];
            //HTML elements that are not editable, but can be enabled and disabled.
            enableableElements: string[];
        };
        forms: {
            //Condition under which a form input element is considered invalid.
            errorCondition: string;
        };
        messaging: {
            //Prefix for message keys stored in local storage.
            messagePrefix: string;
        };
        popups: {
            //Defaults for the window popups
            windowDefaults: {
                height: number;
                width: number;
            }
        };
    }
}
