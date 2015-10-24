/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.services {
    export class StorageService {
        /* @ngInject */
        constructor(private $window: angular.IWindowService) {
            if (typeof Storage === 'undefined') {
                throw Error(`This browser does not support local or session storage.`);
            }
        }

        public getLocal(key: string): any {
            return angular.fromJson(this.$window.localStorage.getItem(key));
        }

        public getSession(key: string): any {
            return angular.fromJson(this.$window.sessionStorage.getItem(key));
        }

        public removeLocal(key: string): void {
            this.$window.localStorage.removeItem(key);
        }

        public removeSession(key: string): void {
            this.$window.sessionStorage.removeItem(key);
        }

        public setLocal(key: string, value: any): void {
            this.$window.localStorage.setItem(key, angular.toJson(value));
        }

        public setSession(key: string, value: any): void {
            this.$window.sessionStorage.setItem(key, angular.toJson(value));
        }
    }

    sharedModule.service('storageService', StorageService);
}
