/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.demo.forms {
    import layout = layouts.sample;

    export class FormsController extends shared.bases.PageController<layout.LayoutController> {
        /* @ngInject */
        constructor($scope: IFormsControllerScope) {
            super($scope, null);
        }
    }

    export interface IFormsControllerScope extends shared.bases.IPageControllerScope<layout.LayoutController> {
    }

    export const route: IPageState = {
        name: 'forms',
        layout: layout.route,
        templateUrl: 'forms/forms.html',
        url: '/forms'
    };

    registerController(FormsController, route);
}
