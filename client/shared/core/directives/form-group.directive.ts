/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.directives {
    const formGroupDirectiveName: string = `${sharedComponentPrefix}FormGroup`;
    const formGroupDirectiveAttributeName: string = `${sharedComponentPrefix}-form-group`;

    sharedModule.directive(formGroupDirectiveName, ['$compile', 'sharedConfig', '$log',
        ($compile: angular.ICompileService, sharedConfig: config.ISharedConfig, $log: angular.ILogService): angular.IDirective => ({
            restrict: 'A',
            compile: (elem: angular.IAugmentedJQuery, attrs: angular.IAttributes): angular.IDirectivePrePost => {
                let formName: string = attrs[formGroupDirectiveName];
                if (!formName) {
                    throw new Error(`Form name must be specified for the ${formGroupDirectiveAttributeName} directive in the ${elem[0].tagName} tag.`);
                }

                //Builds an error condition based on the configured template.
                function buildErrorCondition(controlName: string): string {
                    return sharedConfig.forms.errorCondition
                        .replace(/\{form-name\}/g, formName)
                        .replace(/\{control-name\}/g, `${formName}.${controlName}`);
                }

                //Find all elements with input-group class and set up their styles.
                let inputGroups: angular.IAugmentedJQuery = elem.find('.input-group');
                for (let i: number = 0; i < inputGroups.length; i++) {
                    let inputGroup: JQuery = angular.element(inputGroups[i]);

                    //Find the input element within this group and add the no-ng-style class.
                    let input: JQuery = inputGroup.find('INPUT[ng-model]').first();
                    if (!input.attr('name')) {
                        $log.error(input);
                        throw new Error(`Name attribute needs to be specified on the above element when using the ${formGroupDirectiveAttributeName} directive.`);
                    }
                    input.addClass('no-ng-style');

                    //Build the error condition and add a ng-class attribute using it.
                    let errorCondition: string = buildErrorCondition(input.attr('name'));
                    angular.element(inputGroup).attr('ng-class', `{'ng-input-group-error': ${errorCondition}}`);
                }

                //If the configured error condition uses the form name, we cannot use the ng-
                //classes to style it, so we need to use ng-class.
                if (sharedConfig.forms.errorCondition.indexOf('{form-name}') >= 0) {
                    let inputs: angular.IAugmentedJQuery = elem.find('INPUT:not(.no-ng-style)');
                    for (let i: number = 0; i < inputs.length; i++) {
                        let input: JQuery = angular.element(inputs[i]);
                        let errorCondition: string = buildErrorCondition(input.attr('name'));
                        input.attr('ng-class', `{'ng-input-error': ${errorCondition}}`);
                    }
                }

                //Find all elements that have an ng-messages attribute and configure them to be
                //shown only when the configured error condition is true.
                let allNgMessages: angular.IAugmentedJQuery = elem.find('[ng-messages]');
                if (Boolean(allNgMessages) && allNgMessages.length > 0) {
                    let ngMessages: JQuery = allNgMessages.first();
                    let ngMessagesAttr: string = ngMessages.attr('ng-messages').trim();
                    let controlName: string = ngMessagesAttr.substring(formName.length + 1, ngMessagesAttr.length - '.$error'.length);
                    let errorCondition: string = buildErrorCondition(controlName);
                    ngMessages.attr('ng-show', errorCondition);
                }

                //If the element doesn't already have a form-group class, add one.
                if (!elem.hasClass('form-group')) {
                    elem.addClass('form-group');
                }

                //Remove the directive attribute
                elem.removeAttr(formGroupDirectiveAttributeName);

                return {};
            }
        })
    ]);

}
