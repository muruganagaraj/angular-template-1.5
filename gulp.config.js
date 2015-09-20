'use strict';

module.exports = function () {
    // Root folder
    let rootFolder = './';

    // Other root folders
    let bowerFolder = rootFolder + 'bower_components/';
    let clientFolder = rootFolder + 'client/';
    let nodeModulesFolder = rootFolder + 'node_modules/';
    let serverFolder = rootFolder + 'server/';
    let toolsFolder = rootFolder + 'tools/';
    let typingsFolder = rootFolder + 'typings/';
    let webserverFolder = rootFolder + 'webserver/';

    // Client folders
    // let appFolder = clientFolder + 'app/';
    // let appCommonFolder = clientFolder + 'app-common/';
    // let sharedFolder = clientFolder + 'shared/';
    let assetsFolder = clientFolder + 'assets/';

    // Output folders
    let devBuildFolder = clientFolder + '.dev/';
    let devBuildScriptsFolder = devBuildFolder + 'js/';
    let devBuildStylesFolder = devBuildFolder + 'css/';
    let distBuildFolder = rootFolder + '.dist/';

    // Typescript definition files
    let appDefinitionFileName = 'app.d.ts';
    let appDefinitionFile = typingsFolder + appDefinitionFileName;
    let typescriptDefinitionFiles = [].concat(
        typingsFolder + 'lib.d.ts',
        appDefinitionFile
    );

    let appFolder = clientFolder + 'app/';
    let appModule = {
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

    let appCommonFolder = clientFolder + 'app-common/';
    let appCommonModule = {
        name: 'app-common',
        folder: appCommonFolder,

        tsToCompile: [].concat(
            appCommonFolder + '*.module.ts',
            appCommonFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: devBuildScriptsFolder + 'app-common/',
        jsToInject: [
            devBuildScriptsFolder + 'app-common/**/*.js'
        ],

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

    let sharedFolder = clientFolder + 'shared/';
    let sharedModule = {
        name: 'shared',
        folder: sharedFolder,

        tsToCompile: [].concat(
            sharedFolder + '*.module.ts',
            sharedFolder + 'utils/**/*.ts',
            sharedFolder + 'bases/**/*.ts',
            sharedFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: devBuildScriptsFolder + 'shared/',
        jsToInject: [
            devBuildScriptsFolder + 'shared/extensions/**/*.js',
            devBuildScriptsFolder + 'shared/base-state.js',
            devBuildScriptsFolder + 'shared/*.js',
            devBuildScriptsFolder + 'shared/wrappers/**/*.js',
            devBuildScriptsFolder + 'shared/viewmodel/**/*.js',
            devBuildScriptsFolder + 'shared/**/*.js'
        ],

        lessToCompile: [],
        lessToLint: [],

        lessToWatch: [
            sharedFolder + '**/*.less'
        ],
        cssToCopy: [],

        htmls: {
            all: sharedFolder + '**/*.html',
            root: '/client/shared',
            toCache: sharedFolder + '**/*.html'
        }
    };

    // Bower files
    let bowerConfig = rootFolder + 'bower.json';
    let wiredep = require('wiredep');
    let bowerJsFiles = wiredep({devDependencies: true})['js'];

    let config = {
        modules: [sharedModule, appCommonModule, appModule],

        folders: {
            root: rootFolder,

            client: clientFolder,
            bower: bowerFolder,
            nodeModules: nodeModulesFolder,
            tools: toolsFolder,
            typings: typingsFolder,
            server: serverFolder,
            webserver: webserverFolder,

            // app: appFolder,
            // appCommon: appCommonFolder,
            // shared: sharedFolder,
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
                devBuildScriptsFolder + 'shared/config/*.js'
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
