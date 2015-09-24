/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace shared.bases {
    /**
     * Base controller class that establishes the default constructor parameters and an abstract
     * getParent() method that derived classes must override to specify the parent controller.
     */
    export abstract class BaseController<TParentController> {
        constructor(public $scope: angular.IScope,
                    public res: Resources) {
        }

        protected abstract getParent(): TParentController;
    }

    export abstract class LayoutController<TShellController> extends BaseController<TShellController> {
        constructor($scope: ILayoutControllerScope<TShellController>, res: Resources) {
            super($scope, res);
        }

        public get shell(): TShellController {
            return this.getParent();
        }

        protected getParent(): TShellController {
            return (<ILayoutControllerScope<TShellController>>this.$scope).shell;
        }
    }

    export interface ILayoutControllerScope<TShellController> extends angular.IScope {
        shell: TShellController;
    }

    export abstract class PageController<TLayoutController> extends BaseController<TLayoutController> {
        constructor($scope: IPageControllerScope<TLayoutController>, res: Resources) {
            super($scope, res);
        }

        public get layout(): TLayoutController {
            return this.getParent();
        }

        protected getParent(): TLayoutController {
            return (<IPageControllerScope<TLayoutController>>this.$scope).layout;
        }
    }

    export interface IPageControllerScope<TLayoutController> extends angular.IScope {
        layout: TLayoutController;
    }

    export abstract class NestedPageController<TPageController> extends BaseController<TPageController> {
        constructor($scope: INestedPageControllerScope<TPageController>,
                    private parentControllerAs: string,
                    res: Resources) {
            super($scope, res);
        }

        public get parent(): TPageController {
            return this.getParent();
        }

        protected getParent(): TPageController {
            return this.$scope[this.parentControllerAs];
        }
    }

    export interface INestedPageControllerScope<TPageController> extends angular.IScope {
    }
}
