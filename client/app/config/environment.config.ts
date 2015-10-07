/// <reference path="../../../typings/lib.d.ts" />
/// <reference path="../../../typings/app.d.ts" />

namespace app.config {
    /**
     * Environment-specific configurations for the entire application.
     * The values are specified in the config.json file at the /client folder.
     */
    export interface IConfig {
        apiBaseUrl: string;
    }
}