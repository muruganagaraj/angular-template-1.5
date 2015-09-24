/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.widgets {
    const dropdownWidgetName: string = `${sharedComponentPrefix}Dropdown`;
    // const dropdownWidgetAttributeName: string = `${sharedComponentPrefix}-dropdown`;

    sharedModule.directive(dropdownWidgetName, () => {
        let directive: angular.IDirective = {
            require: 'ngModel',
            compile: (elem: angular.IAugmentedJQuery, attrs: IDropdownWidgetAttributes): angular.IDirectivePrePost => {
                let dropdown: JQuery = $('<select></select>')
                    .attr('ng-model', attrs.ngModel)
                    .attr('ng-options', `x.${attrs.displayText} for x in ${attrs.items} track by x.${attrs.value}`);
                elem.append(dropdown);
                return {};
            }
        };
        return directive;
    });

    interface IDropdownWidgetAttributes extends angular.IAttributes {
        ngModel: string;
        items: string;
        displayText: string;
        value: string;
    }
}
