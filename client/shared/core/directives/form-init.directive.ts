/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.directives {
    const formInitDirectiveName: string = `${sharedComponentPrefix}FormInit`;
    const formInitDirectiveAttributeName: string = `${sharedComponentPrefix}-form-init`;

    sharedModule.directive(formInitDirectiveName, ['$compile', 'sharedConfig', '$log',
        ($compile: angular.ICompileService, sharedConfig: config.ISharedConfig, $log: angular.ILogService): angular.IDirective => ({
            restrict: 'A',
            compile: (elem: angular.IAugmentedJQuery, attrs: angular.IAttributes): angular.IDirectivePrePost => {
                let formName: string = elem.attr('name');

                //Builds an error condition based on the configured template.
                function buildErrorCondition(controlName: string): string {
                    return sharedConfig.forms.errorCondition
                        .replace(/\{form-name\}/g, formName)
                        .replace(/\{control-name\}/g, `${formName}.${controlName}`);
                }

                let formGroups: angular.IAugmentedJQuery = elem.find(`.form-group`);
                formGroups.each((index: number, formGroupElement: Element) => {
                    let formGroup: angular.IAugmentedJQuery = angular.element(formGroupElement);

                    let inputs: angular.IAugmentedJQuery = formGroup.find('[ng-model]');
                    if (Boolean(inputs) && inputs.length > 0) {
                        let input: JQuery = inputs.first();
                        let inputName: string = input.attr('name');
                        if (!inputName) {
                            $log.error(input);
                            throw new Error(`Name attribute needs to be specified on the above element when using the ${formInitDirectiveAttributeName} directive.`);
                        }
                        //Build the error condition and add a ng-class attribute using it.
                        let errorCondition: string = buildErrorCondition(inputName);
                        formGroup.attr('ng-class', `{'has-error': ${errorCondition}}`);

                        let messages: angular.IAugmentedJQuery = formGroup.find('[ng-messages]');
                        if (Boolean(messages) && messages.length > 0) {
                            let message: JQuery = messages.first();
                            if (!message.hasClass('help-block')) {
                                message.addClass('help-block');
                            }
                            message.attr('ng-show', errorCondition);
                        }
                    }
                });
                return {};
            }
        })
    ]);
}
