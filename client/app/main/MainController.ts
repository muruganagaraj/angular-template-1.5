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
        static $inject = ['$location'];

        constructor(private location: ng.ILocationService) {
        }

        data: string;
        items: Item[] = [];

        add(item: string) : void {
            this.items.push(new main.Item(item));
        }

        navigate(): void {
            this.location.path('/other');
        }

        clear(): void {
            this.items = [];
        }
    }
}

angular.module('app').controller("MainController", main.MainController);
