/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.validations {
    export class DateTimeValidationService {
        public compareDates(date1: moment.Moment, date2: moment.Moment): number {
            if (date1.isAfter(date2)) {
                return 1;
            }
            if (date1.isBefore(date2)) {
                return -1;
            }
            return 0;
        }

        public isDatePresentOrFuture(date: moment.Moment): boolean {
            let today: moment.Moment = moment();
            return this.compareDates(date, today) >= 0;
        }

        public isDatePresentOrPast(date: moment.Moment): boolean {
            let today: moment.Moment = moment();
            return this.compareDates(date, today) <= 0;
        }

        public isDateWithinPastPeriod(date: moment.Moment, daysPrior: number, unitOfTime: string = 'days'): boolean {
            return date.isAfter(moment().subtract(daysPrior, unitOfTime));
        }
    }

    sharedModule.service('dateTimeValidationService', DateTimeValidationService);
}
