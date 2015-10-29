/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.config {
    export class SharedConfig implements angular.IServiceProvider {
        private _config: ISharedConfig = {
            checkboxWidgets: {
                checkboxBuilder: null,
                toggleBuilder: null
            },
            dropdownWidgets: {
                singleSelectBuilder: null,
                multiSelectBuilder: null
            },
            enableIf: {
                editableElements: ['INPUT'],
                enableableElements: ['BUTTON']
            },
            forms: {
                changedCondition: null,
                errorCondition: '{control-name}.$invalid',
                validCondition: null
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
        checkboxWidgets: {
            //Function to build a regular checkbox DOM. If not specified, a HTML input[type=checkbox] element is used.
            checkboxBuilder: (attrs: widgets.ICheckboxWidgetAttributes) => JQuery;
            //Function to build a toggle checkbox DOM. If not specified, a HTML input[type=checkbox] element is used.
            toggleBuilder: (attrs: widgets.ICheckboxWidgetAttributes) => JQuery;
        };
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
            //Condition under which a form input element is considered changed.
            changedCondition: string;
            //Condition under which a form input element is considered invalid.
            errorCondition: string;
            //Condition under which a form input element is considered valid.
            validCondition: string;
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
