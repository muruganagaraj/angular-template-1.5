/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BaseShellController {
        constructor(protected $rootScope: angular.IRootScopeService,
                    public res: Resources) {
            $rootScope.$on('$stateChangeSuccess', (event: angular.IAngularEvent, toState: IExtendedState) => {
                this.title = toState.title;
            });
        }

        public title: string;
    }
}
