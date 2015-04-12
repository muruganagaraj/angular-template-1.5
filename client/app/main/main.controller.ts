/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module main {
    export interface IMainViewModel {
        data: string;
        items: Item[];
        add(item: string): void;
        navigate(): void;
        clear(): void;
    }

    export class MainController implements IMainViewModel {
        static $inject: string[] = ['$location', 'config'];

        constructor(private location: ng.ILocationService, private config: IConfig) {
        }

        items: Item[] = [];
        private _data: string;

        add(item: string): void {
            var itemToPush: string;
            if (item === '1') {
                itemToPush = this.config.apiUrl;
            } else {
                itemToPush = `Item: ${item}`;
            }
            this.items.push(new main.Item(itemToPush));
        }

        navigate(): void {
            this.location.path('/other');
        }

        clear(): void {
            this.items = [];
        }


        public get data(): string {
            return this._data;
        }

        public set data(value: string) {
            this._data = value;
        }
    }
}

angular.module('app').controller('MainController', main.MainController);
