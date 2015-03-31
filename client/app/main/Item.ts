/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

module main {
    export class Item {
        constructor(public content: string) {
            this.createdAt = new Date();
        }

        createdAt: Date;
    }
}
