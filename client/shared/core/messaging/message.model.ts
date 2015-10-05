/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.messaging {
    export interface IMessage<T> {
        id: string;
        message: T;
    }
}
