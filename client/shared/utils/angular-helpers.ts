/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

/**
 * Shortcut to create a promise with only a resolved value.
 * @param value The value that will be resolved by the promise.
 * @param $q Instance of the $q service needed to create the promise.
 * @returns {IPromise<T>}
 */
function promiseOf<T>(value: T, $q: ng.IQService): ng.IPromise<T> {
    return new $q((resolve: ng.IQResolveReject<T>) => {
        resolve(value);
    });
}
