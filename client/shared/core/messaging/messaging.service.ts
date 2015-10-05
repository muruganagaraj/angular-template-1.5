/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.messaging {
    export class MessagingService {
        /* @ngInject */
        constructor(private $window: angular.IWindowService,
                    private $timeout: angular.ITimeoutService,
                    private sharedConfig: config.ISharedConfig) {
        }

        public send<T>(id: string, value: T): void {
            // We cannot send a null value as that would clear the item from local storage.
            //TODO: Can we send a falsy value?
            if (!value) {
                throw new Error('Cannot send a falsy value using the messaging service.');
            }
            //TODO: Do we need to delete the local storage item first?
            let storageKey: string = `${this.sharedConfig.messaging.messagePrefix || ''}${id}`;
            this.$window.localStorage.setItem(storageKey, JSON.stringify(value));
            //TODO: Can we remove the token without using the timeout?
            // this.$timeout((): void => {
            this.$window.localStorage.removeItem(storageKey);
            // }, 400);
        }
    }

    sharedModule.service('messagingService', MessagingService);
}
