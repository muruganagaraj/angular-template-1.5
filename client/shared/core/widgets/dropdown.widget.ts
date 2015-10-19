/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.widgets {
    const dropdownWidgetName: string = `${sharedComponentPrefix}Dropdown`;
    // const dropdownWidgetAttributeName: string = `${sharedComponentPrefix}-dropdown`;

    sharedModule.directive(dropdownWidgetName, ['sharedConfig', (sharedConfig: config.ISharedConfig) => {
        //Stock function for building a dropdown. Uses the html select element.
        function buildStockDropdown(attrs: IDropdownWidgetAttributes, multiple: boolean): JQuery {
            let dropdown: JQuery = $('<select></select>')
                .attr('ng-options', `x.${attrs.displayText} for x in ${attrs.items} track by x.${attrs.value}`);
            if (multiple) {
                dropdown.attr('multiple', '');
            }
            return dropdown;
        };

        let directive: angular.IDirective = {
            require: 'ngModel',
            compile: (elem: angular.IAugmentedJQuery, attrs: IDropdownWidgetAttributes): angular.IDirectivePrePost => {
                //Is this a multi-select or single-select dropdown?
                let multiple: boolean = attrs.multiple !== undefined;

                //Get the appropriate configured dropdown builder function
                let builder: (attrs: widgets.IDropdownWidgetAttributes) => JQuery = multiple
                    ? sharedConfig.dropdownWidgets.multiSelectBuilder
                    : sharedConfig.dropdownWidgets.singleSelectBuilder;

                //Build dropdown using the builder function, or if not configured, the stock function.
                let dropdown: JQuery;
                if (Boolean(builder)) {
                    dropdown = builder(attrs);
                } else {
                    dropdown = buildStockDropdown(attrs, multiple);
                }

                //Apply the ng-model attribute in the dropdown element.
                dropdown.attr('ng-model', attrs.ngModel);

                //Other than the widget-specific attributes, copy all other attributes to the new
                //dropdown element and remove them from the directive.
                $(elem[0].attributes).each((index: number, el: Element) => {
                    if (!['multiple', 'items', 'value', 'display-text', 'allow-blank', 'blank-value', 'blank-display-text'].some((v: string) => v === el.nodeName)) {
                        dropdown.attr(el.nodeName, el.nodeValue);
                    }
                    elem.removeAttr(el.nodeName);
                });

                elem.append(dropdown);
                return {};
            }
        };
        return directive;
    }]);

    export interface IDropdownWidgetAttributes extends angular.IAttributes {
        ngModel: string;
        multiple: string;
        items: string;
        value: any;
        displayText: string;
        allowBlank: boolean;
        blankValue: any;
        blankDisplayText: string;
    }
}
