/// <reference path="../../../../typings/lib.d.ts" />
/// <reference path="../../../../typings/app.d.ts" />

namespace app.demo.layouts.sample {
    /* @ngInject */
    export class LayoutController extends shared.bases.LayoutController<common.shell.ShellController> {
        constructor($scope: shared.bases.ILayoutControllerScope<common.shell.ShellController>) {
            super($scope, null);
        }
    }

    export const route: IPageState = createLayoutRoute('sampleLayout', 'layouts/sample/sample-layout.html');
    registerController(LayoutController, route);
}
