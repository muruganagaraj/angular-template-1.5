/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.widgets {
    const checkboxWidgetName: string = `${sharedComponentPrefix}Checkbox`;

    sharedModule.directive(checkboxWidgetName, ['sharedConfig', '$log', (sharedConfig: config.ISharedConfig, $log: angular.ILogService) => {
        //Stock function for building a checkbox. Uses the HTML input[type=checkbox] element.
        function buildStockCheckbox(attrs: ICheckboxWidgetAttributes): JQuery {
            let checkbox: JQuery = $('<input></input>')
                .attr('type', 'checkbox');
                checkbox.addClass('checkbox')
            if (Boolean(attrs.trueValue) && Boolean(attrs.falseValue)) {
                checkbox.attr('ng-true-value', attrs.trueValue);
                checkbox.attr('ng-false-value', attrs.falseValue);
            } else if (Boolean(attrs.trueValue) || Boolean(attrs.falseValue)) {
                $log.warn(`Checkbox widget (${attrs['id'] || attrs['name'] || 'unknown'}) should specify both true-value and false-value attributes or none at all.`)
            }
            return checkbox;
        };

        let directive: angular.IDirective =  {
            require: 'ngModel',
            compile: (elem: angular.IAugmentedJQuery, attrs: ICheckboxWidgetAttributes): angular.IDirectivePrePost => {
                //Is this a regular checkbox or a toggle?
                let toggle: boolean = attrs.toggle !== undefined;

                //Get the appropriate configured checkbox builder function
                let builder: (attrs: widgets.ICheckboxWidgetAttributes) => JQuery = toggle
                    ? sharedConfig.checkboxWidgets.toggleBuilder
                    : sharedConfig.checkboxWidgets.checkboxBuilder;

                //Build dropdown using the builder function, or if not configured, the stock function.
                let checkbox: JQuery;
                if (Boolean(builder)) {
                    checkbox = builder(attrs);
                } else {
                    checkbox = buildStockCheckbox(attrs);
                }

                //Apply the ng-model attribute in the checkbox element.
                checkbox.attr('ng-model', attrs.ngModel);

                //Other than the widget-specific attributes, copy all other attributes to the new
                //checkbox element and remove them from the directive.
                $(elem[0].attributes).each((index: number, el: Element) => {
                    if (!['toggle', 'true-value', 'false-value'].some((v: string) => v === el.nodeName)) {
                        checkbox.attr(el.nodeName, el.nodeValue);
                    }
                    elem.removeAttr(el.nodeName);
                });

                elem.append(checkbox);
                return {};
            }
        };
        return directive;
    }])

    export interface ICheckboxWidgetAttributes extends angular.IAttributes {
        ngModel: string;
        toggle: string;
        trueValue: string;
        falseValue: string;
    }
}
