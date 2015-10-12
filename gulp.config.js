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

    // Client folders
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

    // Bower files
    const bowerConfig = rootFolder + 'bower.json';
    const wiredep = require('wiredep');
    const bowerJsFiles = wiredep({devDependencies: true})['js'];

    const appFolder = `${clientFolder}app/`;
    const appModule = {
        //Name of the module
        name: 'app',
        //Base folder for the module
        folder: appFolder,

        //List of all Typescript files to compile. If not specified, defaults to all *.ts files
        //under the module base folder.
        tsToCompile: null,
        jsToCopy: [],
        jsOutputFolder: `${devBuildScriptsFolder}app/`,
        jsToInject: [`${devBuildScriptsFolder}app/**/*.js`],

        lessToCompile: [
            `${bowerFolder}font-awesome/less/font-awesome.less`,
            `${assetsFolder}less/styles.less`
        ],
        lessToLint: [`${assetsFolder}less/styles.less`],
        lessToWatch: [
            `${assetsFolder}less/**/*.less`,
            `${appFolder}styles/**/*.less`
        ],
        cssToCopy: [],

        htmls: {
            all: `${appFolder}**/*.html`,
            root: '/client/app',
            toCache: `${appFolder}**/*.html`
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

    const appDemoFolder = clientFolder + 'app-demo/';
    const appDemoModule = {
        name: 'app-demo',
        folder: appDemoFolder,

        tsToCompile: [].concat(
            appDemoFolder + '*.module.ts',
            appDemoFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: devBuildScriptsFolder + 'app-demo/',
        jsToInject: [
            devBuildScriptsFolder + 'app-demo/layouts/**/*.js',
            devBuildScriptsFolder + 'app-demo/**/*.js'
        ],

        lessToCompile: [],
        lessToLint: [],
        lessToWatch: [],
        cssToCopy: [],

        htmls: {
            all: appDemoFolder + '**/*.html',
            root: '/client/app-demo',
            toCache: appDemoFolder + '**/*.html'
        }
    };

    const sharedFolder = `${clientFolder}shared/core/`;
    const sharedJsOutputFolder = `${devBuildScriptsFolder}shared/`;
    const sharedModule = {
        name: 'shared',
        folder: sharedFolder,

        tsToCompile: [].concat(
            sharedFolder + '*.module.ts',
            sharedFolder + 'globals/**/*.ts',
            sharedFolder + 'bases/**/*.ts',
            sharedFolder + '**/*.ts'
        ),
        jsToCopy: [],
        jsOutputFolder: sharedJsOutputFolder,
        jsToInject: [
            sharedJsOutputFolder + 'extensions/**/*.js',
            sharedJsOutputFolder + 'base-state.js',
            sharedJsOutputFolder + '*.js',
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

    const modules = [sharedModule, appCommonModule, appDemoModule, appModule];

    const config = {
        options: {
            vetBeforeDevBuild: false
        },

        //List of modules ordered from least dependent to most.
        //The main application module should come last.
        modules: modules,

        //Common folders
        folders: {
            root: rootFolder,

            //All top-level folders
            client: clientFolder,
            bower: bowerFolder,
            nodeModules: nodeModulesFolder,
            tools: toolsFolder,
            typings: typingsFolder,
            server: serverFolder,
            webserver: webserverFolder,

            //Application assets folder
            assets: assetsFolder,

            //Build output folders
            devBuild: devBuildFolder,
            devBuildScripts: devBuildScriptsFolder,
            devBuildStyles: devBuildStylesFolder,
            distBuild: distBuildFolder,
        },


        files: {

        },

        //Path to the shell file.
        shell: clientFolder + 'index.html',

        //Special injections into the shell file that are independent of modules.
        injections: {
            //All CSS to be injected in the correct order.
            //This includes compiled LESS, CSS from bower_components and 3rd-party CSS from the assets folder.
            css: [
                devBuildStylesFolder + 'styles.css',
                devBuildStylesFolder + '**/*.css'
            ],

            //Application script files that must be injected before all other scripts (except bower scripts).
            //Typically, these include module registrations and configurations.
            //Note: Do not include the environment config file that is generated from config.json.
            //      This is handled separately.
            //Note: Order is important here. Typically modules come first, followed by config.
            firstJs: [].concat(
                modules.reduce((files, mod) => {
                    files.unshift(`${devBuildScriptsFolder}${mod.name}/config/*.js`);
                    files.unshift(`${devBuildScriptsFolder}${mod.name}/${mod.name}.module.js`);
                    return files;
                }, [])
            ),
        },

        //Environment-specific config handling
        config: {
            //Path to the environment-specific config data.
            src: clientFolder + 'config.json',

            //Path to generated script file for the config.
            defaultOutput: devBuildScriptsFolder + 'config.js',

            //Environment-specific config is generated as an AngularJS constants service.
            //<moduleName> specifies the name of the module under which to create the service.
            //Typically, this will be the main module.
            moduleName: modules[modules.length - 1].name,

            //Environment to use to generate the config script file if one is not specified.
            defaultEnv: 'local',

            //List of additional environments to create config scripts for during a dist build.
            //These additional config files will be named 'config.<env>.js'
            generateEnvs: ['dev', 'qa', 'uat', 'prod'],

            //Path to the additional config files.
            generatedFiles: devBuildScriptsFolder + 'config*.js'
        },

        //Typescript definition file config
        definitions: {
            //File name of the definition file for application files.
            appFileName: appDefinitionFileName,

            //Path to the definition file for application files.
            appFile: appDefinitionFile,

            //Empty template of the definition file for application files.
            //Contains only the necessary placeholders for the injector.
            appTemplate: typingsFolder + 'app.d.ts.template',

            //List of all definition files (application, bower, etc.)
            all: typescriptDefinitionFiles
        },

        tslint: [
            {
                description: 'Application script files',
                config: toolsFolder + 'tslint/tslint-app.json',
                files: modules
                    .filter(mod => mod.name.substr(0, 'app'.length) === 'app')
                    .reduce((files, mod) => files.concat(mod.tsToCompile || `${mod.folder}**/*.ts`), [])
            },
            {
                description: 'Shared module script files',
                config: toolsFolder + 'tslint/tslint-shared.json',
                files: modules
                    .filter(mod => mod.name.substr(0, 'shared'.length) === 'shared')
                    .reduce((files, mod) => files.concat(mod.tsToCompile), [])
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
        }
    ];

    /**
     * Accepts a glob and marks it as excluded by prepending it with a bang symbol.
     * @param glob The string or string array that represents the glob
     */
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
