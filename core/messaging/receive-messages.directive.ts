/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.messaging {
    const receiveMessagesDirectiveName: string = `${sharedComponentPrefix}ReceiveMessages`;

    sharedModule.directive(receiveMessagesDirectiveName,
        ['$window', 'sharedConfig', (
            $window: angular.IWindowService,
            sharedConfig: config.ISharedConfig): angular.IDirective => ({
        restrict: 'A',
        link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void => {
            //Get the list of message IDs to subscribe to.
            //If nothing specified, then don't handle anything.
            let ids: string[] = (attrs[receiveMessagesDirectiveName] || '')
                .split(' ')
                .filter((id: string) => id.length > 0);
            if (ids.length === 0 || ids[0].length === 0) {
                return;
            }

            //Handle the storage event.
            angular.element($window).on('storage', (e: JQueryEventObject) => {
                let storageEvent: StorageEvent = <StorageEvent>e.originalEvent;
                let storageKey: string = storageEvent.key;
                let id: string = storageKey.substr(sharedConfig.messaging.messagePrefix.length);
                if (!ids.some((item: string) => item === id)) {
                    return;
                }
                let value: any = storageEvent.newValue;
                if (!value) {
                    return;
                }
                let message: IMessage = {
                    id: id,
                    message: typeof(value) === 'string' ? angular.fromJson(value) : value
                };
                scope.$broadcast('$onMessageReceived', message);
            });

            //Unsubscribe to the storage event when the scope is destroyed.
            scope.$on('$destroy', () => {
                angular.element($window).off('storage');
            });
        }
    })]);
}
