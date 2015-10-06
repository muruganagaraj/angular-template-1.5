/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.services {
    export class ViewModelService {
        public dateToVmDate(date: any): ViewModelDate {
            if (!date) {
                return undefined;
            }
            if (typeof date === 'string') {
                let jsDate: Date = new Date(date);
                if (moment.isDate(jsDate)) {
                    return this.jsDateToString(jsDate);
                } else {
                    let momentDate: moment.Moment = moment(date);
                    return moment.isMoment(momentDate) ? momentDate.format('MM/DD/YYYY') : undefined;
                }
            }
            if (moment.isDate(date)) {
                return this.jsDateToString(date);
            }
            if (moment.isMoment(date)) {
                return date.format('MM/DD/YYYY');
            }
            return undefined;
        }

        public vmDateToDate(date: ViewModelDate): Date {
            if (!date) {
                return undefined;
            }
            let momentDate: moment.Moment = moment(date, 'MM/DD/YYYY');
            return moment.isMoment(momentDate) ? momentDate.toDate() : undefined;
        }

        private jsDateToString(dt: Date): string {
            let month: string = (dt.getMonth() + 1).toString().padLeft(2, '0');
            let day: string = dt.getDate().toString().padLeft(2, '0');
            let year: string = dt.getFullYear().toString().padLeft(4, '0');
            return `${month}/${day}/${year}`;
        }

        public vmSortOrderToSortOrder(sortOrder: SortOrder): string {
            return !sortOrder || sortOrder === SortOrder.ascending ? 'ASC' : 'DESC';
        }

        public sortOrderToVmSortOrder(sortOrder: string): SortOrder {
            return !sortOrder || sortOrder === 'ASC' ? SortOrder.ascending : SortOrder.descending;
        }

        public getServerField(fields: ServerFieldMapping[], clientField: string): string {
            let match: ServerFieldMapping = fields.find((field: ServerFieldMapping) => field.client === clientField);
            return Boolean(match) ? match.server : undefined;
        }
    }

    sharedModule.service('viewModelService', ViewModelService);
}
