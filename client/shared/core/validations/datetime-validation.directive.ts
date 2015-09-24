/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.validations {
    const dateAfterDirectiveName: string = `${sharedComponentPrefix}DateAfter`;
    const dateAfterErrorKey: string = 'dateAfter';

    sharedModule.directive(dateAfterDirectiveName, ['$parse', 'dateTimeValidationService',
        ($parse: angular.IParseService, dateTimeValidationService: DateTimeValidationService) => ({
            require: 'ngModel',
            restrict: 'A',
            link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.INgModelController): void => {
                function validate(value: any, otherValue: any): boolean {
                    if (!value || !otherValue) {
                        return true;
                    }
                    let date: moment.Moment = moment(value);
                    let otherDate: moment.Moment = moment(otherValue);
                    return dateTimeValidationService.compareDates(date, otherDate) > 0;
                }
                scope.$watch(attrs[dateAfterDirectiveName], (newValue: any) => {
                    controller.$setValidity(dateAfterErrorKey, validate(controller.$viewValue, newValue));
                });
                controller.$validators[dateAfterErrorKey] = (value: string) => {
                    let otherDate: any = $parse(attrs[dateAfterDirectiveName])(scope);
                    return validate(value, otherDate);
                };
            }
        })
    ]);

    const dateBeforeDirectiveName: string = `${sharedComponentPrefix}DateBefore`;
    const dateBeforeErrorKey: string = 'dateBefore';

    sharedModule.directive(dateBeforeDirectiveName, ['$parse', 'dateTimeValidationService',
        ($parse: angular.IParseService, dateTimeValidationService: DateTimeValidationService) => ({
            require: 'ngModel',
            restrict: 'A',
            link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.INgModelController): void => {
                function validate(value: any, otherValue: any): boolean {
                    if (!value || !otherValue) {
                        return true;
                    }
                    let date: moment.Moment = moment(value);
                    let otherDate: moment.Moment = moment(otherValue);
                    return dateTimeValidationService.compareDates(date, otherDate) < 0;
                }
                scope.$watch(attrs[dateBeforeDirectiveName], (newValue: any) => {
                    controller.$setValidity(dateBeforeErrorKey, validate(controller.$viewValue, newValue));
                });
                controller.$validators[dateBeforeErrorKey] = (value: string) => {
                    let otherDate: any = $parse(attrs[dateBeforeDirectiveName])(scope);
                    return validate(value, otherDate);
                };
            }
        })
    ]);

    const datePresentOrFutureDirectiveName: string = `${sharedComponentPrefix}DatePresentOrFuture`;
    const datePresentOrFutureErrorKey: string = 'datePresentOrFuture';

    sharedModule.directive(datePresentOrFutureDirectiveName, ['dateTimeValidationService',
        (dateTimeValidationService: DateTimeValidationService) => ({
            require: 'ngModel',
            restrict: 'A',
            link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.INgModelController): void => {
                controller.$validators[datePresentOrFutureErrorKey] = (value: string) => {
                    let date: moment.Moment = moment(value);
                    return dateTimeValidationService.isDatePresentOrFuture(date);
                };
            }
        })
    ]);

    const datePresentOrPastDirectiveName: string = `${sharedComponentPrefix}DatePresentOrPast`;
    const datePresentOrPastErrorKey: string = 'datePresentOrPast';

    sharedModule.directive(datePresentOrPastDirectiveName, ['dateTimeValidationService',
        (dateTimeValidationService: DateTimeValidationService) => ({
            require: 'ngModel',
            restrict: 'A',
            link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.INgModelController): void => {
                controller.$validators[datePresentOrPastErrorKey] = (value: string) => {
                    let date: moment.Moment = moment(value);
                    return dateTimeValidationService.isDatePresentOrPast(date);
                };
            }
        })
    ]);

    const dateWithinPastPeriodDirectiveName: string = `${sharedComponentPrefix}DateWithinPastPeriod`;
    const dateWithinPastPeriodErrorKey: string = 'dateWithinPastPeriod';

    sharedModule.directive(dateWithinPastPeriodDirectiveName, ['dateTimeValidationService',
        (dateTimeValidationService: DateTimeValidationService) => ({
            require: 'ngModel',
            restrict: 'A',
            link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.INgModelController): void => {
                let period: number = parseInt(attrs[dateWithinPastPeriodDirectiveName]);
                if (isNaN(period)) {
                    console.error(`Period specified for ${dateWithinPastPeriodDirectiveName} directive is not a valid integer.`);
                    return;
                }
                controller.$validators[dateWithinPastPeriodErrorKey] = (value: string)  => {
                    let date: moment.Moment = moment(value);
                    return dateTimeValidationService.isDateWithinPastPeriod(date, period);
                };
            }
        })
    ]);
}
