/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.directives {
    const inputGroupDirectiveName: string = `${sharedComponentPrefix}InputGroup`;
    // const inputGroupDirectiveAttributeName: string = `${sharedComponentPrefix}-input-group`;

    sharedModule.directive(inputGroupDirectiveName, ['$compile', 'sharedConfig',
        ($compile: angular.ICompileService, sharedConfig: config.ISharedConfig) => {
            let directive: angular.IDirective = {
                restrict: 'A',
                compile: (elem: angular.IAugmentedJQuery, attrs: angular.IAttributes): angular.IDirectivePrePost => {
                    let inputGroup: JQuery = elem.find('DIV.input-group').first();
                    let ngClass: string = sharedConfig.inputGroup.condition.replace(/\{control-name\}/g, attrs[inputGroupDirectiveName]);
                    inputGroup.attr('ng-class', `{'ng-input-group': ${ngClass}}`);

                    let input: JQuery = elem.find('INPUT[ng-model]').first();
                    input.attr('no-ng-style', '');

                    return {};
                }
            };
            return directive;
        }
    ]);
}
