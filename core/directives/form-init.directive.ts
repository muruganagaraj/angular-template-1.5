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

                //Builds a condition string based on the configured template.
                function buildCondition(conditionTemplate: string, controlName: string): string {
                    if (!conditionTemplate) {
                        return null;
                    }
                    return conditionTemplate
                        .replace(/\{form-name\}/g, formName)
                        .replace(/\{control-name\}/g, `${formName}.${controlName}`);
                }

                function buildNgClass(...conditions: TextPair[]): string {
                    let ngClass: string = '';
                    for (let i: number = 0; i < conditions.length; i++) {
                        if (Boolean(conditions[i].text) && conditions[i].text.length > 0) {
                            if (ngClass.length > 0) {
                                ngClass += ',';
                            }
                            ngClass += `'${conditions[i].value}': ${conditions[i].text}`;
                        }
                    }
                    return `{${ngClass}}`;
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
                        //Build the various conditions and add a ng-class attribute using it.
                        let changedCondition: string = buildCondition(sharedConfig.forms.changedCondition, inputName);
                        let errorCondition: string = buildCondition(sharedConfig.forms.errorCondition, inputName);
                        let validCondition: string = buildCondition(sharedConfig.forms.validCondition, inputName);
                        let ngClass: string = buildNgClass(
                            { value: 'has-warning', text: changedCondition },
                            { value: 'has-success', text: validCondition },
                            { value: 'has-error', text: errorCondition }
                        );
                        formGroup.attr('ng-class', ngClass);

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
