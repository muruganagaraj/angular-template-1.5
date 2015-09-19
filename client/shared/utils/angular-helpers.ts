/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

declare let appComponentPrefix: string;
declare let sharedComponentPrefix: string;

/**
 * Registers a route (and optional secondary routes) and registers the associated controller.
 * 
 * @param {Function} controllerConstructor - The controller class to register.
 * @param {IExtendedState} route - The primary route to register.
 * @param {IExtendedState[]} secondaryRoutes - Optional secondary routes for the controller.
 * @param {angular.IModule} module - The Angular module to register the controller and configure the route(s)
 * @param {string} constantsName - The name of the constants Angular constant (of type IConstants) that contains the template URL root.
 *
 * @returns {angular.IModule} The Angular module in which the controller is registered.
 */
function registerControllers(
    controllerConstructor: Function,
    route: IExtendedState,
    secondaryRoutes: IExtendedState[],
    module: angular.IModule,
    constantsName: string): angular.IModule {

    let routes: IExtendedState[] = setupRoutes(route, secondaryRoutes);
    module.config(['$stateProvider', constantsName,
        ($stateProvider: angular.ui.IStateProvider, constants: IConstants) => {
            for (let i: number = 0; i < routes.length; i++) {
                routes[i].templateUrl = `${constants.templateUrlRoot}${route.templateUrl}`;
                $stateProvider.state(routes[i]);
            }
        }
    ]);

    return module.controller(<string>route.controller, controllerConstructor);
}

function setupRoutes(route: IExtendedState, secondaryRoutes: IExtendedState[]): IExtendedState[] {
    if (route.controllerAs === 'layout') {
        return [route].concat(secondaryRoutes || []);
    }

    route.controllerAs = route.name.snakeCaseToCamelCase();
    route.controller = `${route.controllerAs}Controller`;

    for (let i: number; i < (secondaryRoutes || []).length; i++) {
        secondaryRoutes[i].controllerAs = route.controllerAs;
        secondaryRoutes[i].controller = route.controller;
    }

    return [route].concat(secondaryRoutes || []);
}

function createLayoutRoute(name: string, templateUrl: string): IExtendedState {
    return <IExtendedState>{
        name: name,
        url: '^',
        templateUrl: templateUrl,
        controller: `${name}Controller`,
        controllerAs: 'layout',
        abstract: true
    };
}

/**
 * Shortcut to create a promise with only a resolved value.
 * @param value The value that will be resolved by the promise.
 * @param $q Instance of the $q service needed to create the promise.
 * @returns {IPromise<T>}
 */
function promiseOf<T>(value: T, $q: angular.IQService): angular.IPromise<T> {
    return new $q((resolve: angular.IQResolveReject<T>) => {
        resolve(value);
    });
}
