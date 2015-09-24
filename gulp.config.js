'use strict';

module.exports = function () {
    // Root folder
    const rootFolder = './';

    // Other root folders
    const bowerFolder = rootFolder + 'bower_components/';
    const clientFolder = rootFolder + 'client/';
    const nodeModulesFolder = rootFolder + 'node_modules/';
    const serverFolder = rootFolder + 'server/';
    const toolsFolder = rootFolder + 'tools/';
    const typingsFolder = rootFolder + 'typings/';
    const webserverFolder = rootFolder + 'webserver/';

    // Assets folders
    const assetsFolder = clientFolder + 'assets/';

    // Output folders
    const devBuildFolder = clientFolder + '.dev/';
    const devBuildScriptsFolder = devBuildFolder + 'js/';
    const devBuildStylesFolder = devBuildFolder + 'css/';
    const distBuildFolder = rootFolder + '.dist/';

    // Typescript definition files
    const appDefinitionFileName = 'app.d.ts';
    const appDefinitionFile = typingsFolder + appDefinitionFileName;
    const typescriptDefinitionFiles = [].concat(
        typingsFolder + 'lib.d.ts',
        appDefinitionFile
    );

    const appFolder = clientFolder + 'app/';
    const appModule = {
        name: 'app',
        folder: appFolder,

        tsToCompile: [].concat(
            appFolder + '*.module.ts',
            appFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: devBuildScriptsFolder + 'app/',
        jsToInject: [
            devBuildScriptsFolder + 'app/**/*.js'
        ],

        lessToCompile: [
            bowerFolder + 'font-awesome/less/font-awesome.less',
            assetsFolder + 'less/styles.less'
        ],
        lessToLint: [
            assetsFolder + 'less/styles.less'
        ],
        lessToWatch: [
            assetsFolder + 'less/styles.less'
        ],
        cssToCopy: [],

        htmls: {
            all: appFolder + '**/*.html',
            root: '/client/app',
            toCache: appFolder + '**/*.html'
        }
    };

    const appCommonFolder = clientFolder + 'app-common/';
    const appCommonModule = {
        name: 'app-common',
        folder: appCommonFolder,

        tsToCompile: [].concat(
            appCommonFolder + '*.module.ts',
            appCommonFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: devBuildScriptsFolder + 'app-common/',
        jsToInject: [devBuildScriptsFolder + 'app-common/**/*.js'],

        lessToCompile: [],
        lessToLint: [],
        lessToWatch: [],
        cssToCopy: [],

        htmls: {
            all: appCommonFolder + '**/*.html',
            root: '/client/app-common',
            toCache: appCommonFolder + '**/*.html'
        }
    };

    const sharedFolder = `${clientFolder}shared/core/`;
    const sharedJsOutputFolder = `${devBuildScriptsFolder}shared/`;
    const sharedModule = {
        name: 'shared',
        folder: sharedFolder,

        tsToCompile: [].concat(
            sharedFolder + '*.module.ts',
            sharedFolder + 'utils/**/*.ts',
            sharedFolder + 'bases/**/*.ts',
            sharedFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: sharedJsOutputFolder,
        jsToInject: [
            sharedJsOutputFolder + 'extensions/**/*.js',
            sharedJsOutputFolder + 'base-state.js',
            sharedJsOutputFolder + '*.js',
            sharedJsOutputFolder + 'wrappers/**/*.js',
            sharedJsOutputFolder + 'viewmodel/**/*.js',
            sharedJsOutputFolder + '**/*.js'
        ],

        lessToCompile: [],
        lessToLint: [],

        lessToWatch: [
            sharedFolder + '**/*.less'
        ],
        cssToCopy: [],

        htmls: {
            all: sharedFolder + '**/*.html',
            root: '/client/shared/core',
            toCache: sharedFolder + '**/*.html'
        }
    };

    const sharedNgUiFolder = clientFolder + 'shared/ng-ui/';
    const sharedNgUiJsOutputFolder = devBuildScriptsFolder + 'shared-ng-ui/';
    const sharedNgUiModule = {
        name: 'shared-ng-ui',
        folder: sharedNgUiFolder,

        tsToCompile: [].concat(
            sharedNgUiFolder + '*.module.ts',
            sharedNgUiFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: sharedNgUiJsOutputFolder,
        jsToInject: [sharedNgUiJsOutputFolder + '**/*.js'],

        lessToCompile: [],
        lessToLint: [],

        lessToWatch: [sharedNgUiFolder + '**/*.less'],
        cssToCopy: [],

        htmls: {
            all: sharedNgUiFolder + '**/*.html',
            root: '/client/shared/ng-ui',
            toCache: sharedNgUiFolder + '**/*.html'
        }
    };

    // Bower files
    const bowerConfig = rootFolder + 'bower.json';
    const wiredep = require('wiredep');
    const bowerJsFiles = wiredep({devDependencies: true})['js'];

    const config = {
        modules: [sharedNgUiModule, sharedModule, appCommonModule, appModule],

        folders: {
            root: rootFolder,

            client: clientFolder,
            bower: bowerFolder,
            nodeModules: nodeModulesFolder,
            tools: toolsFolder,
            typings: typingsFolder,
            server: serverFolder,
            webserver: webserverFolder,

            assets: assetsFolder,

            devBuild: devBuildFolder,
            devBuildScripts: devBuildScriptsFolder,
            devBuildStyles: devBuildStylesFolder,
            distBuild: distBuildFolder,
        },

        shell: clientFolder + 'index.html',

        injections: {
            css: [
                devBuildStylesFolder + 'styles.css',
                devBuildStylesFolder + '**/*.css'
            ],

            firstJs: [
                devBuildScriptsFolder + 'app/app.module.js',
                devBuildScriptsFolder + 'app/config/*.js',
                devBuildScriptsFolder + 'app-common/app-common.module.js',
                devBuildScriptsFolder + 'app-common/config/*.js',
                devBuildScriptsFolder + 'shared/shared.module.js',
                devBuildScriptsFolder + 'shared/config/*.js',
                devBuildScriptsFolder + 'shared-ng-ui/shared-ng-ui.module.js',
                devBuildScriptsFolder + 'shared-ng-ui/config/*.js'
            ],
        },

        config: {
            src: clientFolder + 'config.json',
            defaultOutput: devBuildScriptsFolder + 'config.js',
            moduleName: appModule.name,
            defaultEnv: 'local',
            generateEnvs: ['dev', 'qa', 'uat', 'prod'],
            generatedFiles: devBuildScriptsFolder + 'config*.js'
        },

        definitions: {
            appFileName: appDefinitionFileName,
            appFile: appDefinitionFile,
            appTemplate: typingsFolder + 'app.d.ts.template',
            all: typescriptDefinitionFiles
        },

        tslint: [
            {
                config: toolsFolder + 'tslint/tslint-app.json',
                files: [].concat(appCommonModule.tsToCompile).concat(appModule.tsToCompile)
            },
            {
                config: toolsFolder + 'tslint/tslint-shared.json',
                files: [].concat(sharedModule.tsToCompile)
            }
        ],

        webServerConfigs: {
            iis: {
                src: 'web.config'
            },
            apache: {
                src: '.htaccess'
            },
            tomcat: {
                src: 'WEB-INF/**/*.*',
                dest: 'WEB-INF/'
            }
        },

        wiredepOptions: {
            bowerJson: require(bowerConfig),
            ignorePath: '..',
            exclude: []
        },

        bower: {
            jsFiles: bowerJsFiles
        },

        typescript: {
            targetVersion: 'ES5'
        },

        // Configuration for the Node.js server
        server: {
            entryPoint: serverFolder + 'server.js',
            watch: serverFolder,
            nodeHostPort: 7709,
            customHostPort: 7710
        },
    };

    // Reusable function to retrieve details of all style asset files in the project.
    // Used for both DEV and DIST builds.
    // cssFolder and cssParentFolder represent the build folder where all styles are placed
    // and its parent folder, respectively.
    // If areImages is true, then the images are optimized during a DIST build.
    config.getStyleAssets = (cssFolder, cssParentFolder) => [
        {
            src: bowerFolder + 'bootstrap/dist/fonts/**/*.*',
            dest: cssParentFolder + 'fonts/',
            areImages: false
        },
        {
            src: bowerFolder + 'font-awesome/fonts/**/*.*',
            dest: cssParentFolder + 'fonts/',
            areImages: false
        },
        {
            src: assetsFolder + 'images/**/*.*',
            dest: cssParentFolder + 'images/',
            areImages: true
        },
        {
            src: config.folders.assets + 'fonts/*',
            dest: cssParentFolder + 'fonts/',
            areImages: false
        },
        {
            src: [
                bowerFolder + 'angular-ui-grid/ui-grid.eot',
                bowerFolder + 'angular-ui-grid/ui-grid.svg',
                bowerFolder + 'angular-ui-grid/ui-grid.ttf',
                bowerFolder + 'angular-ui-grid/ui-grid.woff'
            ],
            dest: cssFolder,
            areImages: false
        }
    ];

    function exclude(glob) {
        if (typeof glob === 'string') {
            return '!' + glob;
        }
        return glob.map(function(g) {
            return '!' + g;
        });
    }

    function excludeSpecs(glob) {
        if (typeof glob === 'string') {
            return [glob, exclude(glob.replace('.ts','.spec.ts'))]
        }
        return glob.reduce(function(prev, next) {
            prev.push(next)
            prev.push(exclude(next.replace('.ts', '.spec.ts')));
            return prev;
        }, []);
    }

    config.exclude = exclude;
    config.excludeSpecs = excludeSpecs;

    return config;
};
