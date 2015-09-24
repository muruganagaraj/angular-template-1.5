/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

interface IPageState extends angular.ui.IState {
    layout?: angular.ui.IState,
    title?: string;
}

interface ILayoutState extends angular.ui.IState {
}
