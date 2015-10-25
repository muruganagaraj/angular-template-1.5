/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.directives {
    const titleDirectiveName: string = `${sharedComponentPrefix}Title`;

    /**
     * Applied to the title element under the head section.
     * Uses the original text as the suffix for titles and watches the specified attribute value
     * for changes to the title.
     */
    sharedModule.directive(titleDirectiveName, () => {
        let directive: angular.IDirective = {
            restrict: 'A',
            link: (scope: angular.IScope, elem: angular.IAugmentedJQuery, attrs: angular.IAttributes): void => {
                let suffix: string = elem.text() || '';
                scope.$watch(attrs[titleDirectiveName], (newValue: string): void => {
                    if (Boolean(newValue)) {
                        elem.text(`${newValue} - ${suffix}`);
                    } else {
                        elem.text(suffix);
                    }
                });
            }
        };
        return directive;
    });
}
