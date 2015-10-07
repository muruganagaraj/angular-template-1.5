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

            let $location: angular.ILocationService = $injector.get<angular.ILocationService>('$location');
            let windowId: string = $location.search()['__u'];
            if (Boolean(windowId)) {
                let storageService: services.StorageService = $injector.get<services.StorageService>('storageService');
                let windowInputKey: string = bases.windowInputKey(windowId);
                this.input = storageService.getLocal(windowInputKey);
                storageService.removeLocal(windowInputKey);
            }
        }

        /**
         * Title of the browser window/tab. Used with the title directive in the shell HTML.
         */
        public title: string;

        /**
         * Inputs to the window. Typically used when the app creates a new tab or window popup.
         */
        public input: any;

        protected $rootScope: angular.IRootScopeService;
    }
}
