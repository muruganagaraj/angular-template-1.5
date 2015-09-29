/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.widgets {
    const dropdownWidgetName: string = `${sharedComponentPrefix}Dropdown`;
    // const dropdownWidgetAttributeName: string = `${sharedComponentPrefix}-dropdown`;

    sharedModule.directive(dropdownWidgetName, ['sharedConfig', (sharedConfig: config.ISharedConfig) => {
        let directive: angular.IDirective = {
            require: 'ngModel',
            compile: (elem: angular.IAugmentedJQuery, attrs: IDropdownWidgetAttributes): angular.IDirectivePrePost => {
                let dropdown: JQuery;
                if (Boolean(sharedConfig.dropdownBuilder)) {
                    dropdown = sharedConfig.dropdownBuilder(attrs);
                } else {
                    dropdown = $('<select></select>')
                        .attr('ng-options', `x.${attrs.displayText} for x in ${attrs.items} track by x.${attrs.value}`);
                }
                dropdown.attr('ng-model', attrs.ngModel);
                $(elem[0].attributes).each((index: number, el: Element) => {
                    if (!['items', 'value', 'display-text', 'allow-blank', 'blank-value', 'blank-display-text'].some((v: string) => v === el.nodeName)) {
                        dropdown.attr(el.nodeName, el.nodeValue);
                    }
                });
                elem.append(dropdown);
                return {};
            }
        };
        return directive;
    }]);

    export interface IDropdownWidgetAttributes extends angular.IAttributes {
        ngModel: string;
        items: string;
        value: any;
        displayText: string;
        allowBlank: boolean;
        blankValue: any;
        blankDisplayText: string;
    }
}
