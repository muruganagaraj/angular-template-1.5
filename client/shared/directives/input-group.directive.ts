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
                    let formName: string = attrs[inputGroupDirectiveName];
                    let inputGroups: angular.IAugmentedJQuery = elem.find('DIV.input-group');
                    for (let i: number = 0; i < inputGroups.length; i++) {
                        let inputGroup: JQuery = angular.element(inputGroups[i]);

                        let input: JQuery = inputGroup.find('INPUT[ng-model]').first();
                        input.addClass('no-ng-style');

                        let ngClass: string = sharedConfig.inputGroup.condition
                            .replace(/\{form-name\}/g, formName)
                            .replace(/\{control-name\}/g, `${formName}.${input.attr('name')}`);
                        angular.element(inputGroup).attr('ng-class', `{'ng-input-group': ${ngClass}}`);
                    }

                    // input.attr('no-ng-style', '');

                    return {};
                }
            };
            return directive;
        }
    ]);
}
