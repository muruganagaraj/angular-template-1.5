/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BaseShellController {
        constructor($injector: angular.auto.IInjectorService,
                    public res: Resources) {
            this.$rootScope = $injector.get<angular.IRootScopeService>('$rootScope');

            //Change browser title on successful state change.
            this.$rootScope.$on('$stateChangeSuccess', (event: angular.IAngularEvent, toState: IPageState) => {
                this.title = toState.title;
            });

            //If a window input message is received, broadcast it to all scopes.
            this.$rootScope.$on('$onMessageReceived', (event: angular.IAngularEvent, message: messaging.IMessage) => {
                if (message.id === '$windowInput') {
                    this.$rootScope.$broadcast('$onWindowInput', (<IWindowInput>message.message).input);
                }
            });
        }

        public title: string;
        protected $rootScope: angular.IRootScopeService;
    }
}
