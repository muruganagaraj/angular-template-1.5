/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.directives {
    const enableIfDirectiveName: string = `${sharedComponentPrefix}EnableIf`;
    const enableIfDirectiveAttributeName: string = `${sharedComponentPrefix}-enable-if`;

    //Name of the shouldDisable function
    const shouldDisable: string = 'shouldDisable';

    sharedModule.directive(enableIfDirectiveName, ['$compile', '$rootScope', 'sharedConfig',
        ($compile: angular.ICompileService, $rootScope: IEnableIfRootScope, sharedConfig: config.ISharedConfig) => {
            let allControls: string[] = sharedConfig.editableElements.concat(sharedConfig.enableableElements);
            let selector: string = allControls.join(',').toLowerCase();

            //Set up a shouldDisable function on the root scope, if it doesn't already exist.
            if (!$rootScope.shouldDisable) {
                $rootScope.shouldDisable = (conditions: boolean[]): boolean =>
                    (conditions || []).anyFalsy();
            }

            //If the readonly-as-disabled attribute is specified, some elements need to be made
            //read-only instead of disabled.
            function getAttributeName(tagName: string, readonlyAsDisabled: boolean): string {
                if (sharedConfig.enableableElements.some((tag: string) => tagName === tag)) {
                    return 'ng-disabled';
                }
                return readonlyAsDisabled ? 'ng-readonly' : 'ng-disabled';
            }

            //Builds a new condition string by combining the existing attribute value with the new
            //condition.
            function getNewCondition(existingValue: string, condition: string): string {
                if (!existingValue) {
                    return `${shouldDisable}([${condition}])`;
                }
                if (existingValue.startsWith(`${shouldDisable}([`)) {
                    let str1: string = existingValue.substr(0, existingValue.indexOf('])'));
                    let str2: string = existingValue.substr(existingValue.indexOf('])'));
                    return `${str1}, ${condition}${str2}`;
                } else {
                    return `${shouldDisable}([${condition}]) || (${existingValue})`;
                }
            }

            let directive: angular.IDirective = {
                restrict: 'A',
                compile: (elem: angular.IAugmentedJQuery, attrs: IEnableIfAttributes): angular.IDirectivePrePost => {
                    let condition: string = attrs[enableIfDirectiveName];
                    if (!condition) {
                        return {};
                    }
                    let controls: angular.IAugmentedJQuery = elem.find(selector);
                    let readonlyAsDisabled: boolean = attrs.readonlyAsDisabled !== undefined;
                    for (let i: number = 0; i < controls.length; i++) {
                        let control: angular.IAugmentedJQuery = angular.element(controls[i]);
                        if (control.attr(enableIfDirectiveAttributeName)) {
                            continue;
                        }
                        let attrName: string = getAttributeName(controls[i].tagName, readonlyAsDisabled);
                        let attrValue: string = control.attr(attrName);
                        control.attr(attrName, getNewCondition(attrValue, condition));
                    }
                    return {};
                }
            };
            return directive;
        }
    ]);

    interface IEnableIfRootScope extends angular.IRootScopeService {
        shouldDisable: (conditions: boolean[]) => boolean;
    }

    interface IEnableIfAttributes extends angular.IAttributes {
        readonlyAsDisabled: string;
    }
}
