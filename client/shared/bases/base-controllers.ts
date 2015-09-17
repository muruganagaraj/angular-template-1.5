/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace shared.bases {
    export abstract class BaseController<TParentController> {
        constructor(public $scope: ng.IScope,
                    public res: Resources) {
        }

        protected abstract getParent(): TParentController;
    }

    export class BaseRootController<TShellController> extends BaseController<TShellController> {
        constructor($scope: IBaseRootControllerScope<TShellController>, res: Resources) {
            super($scope, res);
        }

        public get shell(): TShellController {
            return this.getParent();
        }

        protected getParent(): TShellController {
            return (<IBaseRootControllerScope<TShellController>>this.$scope).shell;
        }
    }

    export interface IBaseRootControllerScope<TShellController> extends ng.IScope {
        shell: TShellController;
    }

    export class BaseNestedController<TParentController> extends BaseController<TParentController> {
        constructor($scope: IBaseNestedControllerScope<TParentController>,
                    private parentControllerAs: string,
                    res: Resources) {
            super($scope, res);
        }

        public get parent(): TParentController {
            return this.getParent();
        }

        protected getParent(): TParentController {
            return this.$scope[this.parentControllerAs];
        }
    }

    export interface IBaseNestedControllerScope<TParentController> extends ng.IScope {
    }
}
