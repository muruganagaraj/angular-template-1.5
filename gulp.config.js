'use strict';

module.exports = function () {
    // Root folder
    const rootFolder = './';

    // Other root folders
    const bowerFolder = `${rootFolder}bower_components/`;
    const clientFolder = `${rootFolder}client/`;
    const nodeModulesFolder = `${rootFolder}node_modules/`;
    const serverFolder = `${rootFolder}server/`;
    const toolsFolder = `${rootFolder}tools/`;
    const typingsFolder = `${rootFolder}typings/`;
    const webserverFolder = `${rootFolder}webserver/`;

    // Client folders
    const assetsFolder = `${clientFolder}assets/`;

    // Output folders
    const devBuildFolder = `${clientFolder}.dev/`;
    const devBuildScriptsFolder = `${devBuildFolder}js/`;
    const devBuildStylesFolder = `${devBuildFolder}css/`;
    const distBuildFolder = `${rootFolder}.dist/`;

    // Typescript definition files
    const appDefinitionFileName = 'app.d.ts';
    const appDefinitionFile = typingsFolder + appDefinitionFileName;
    const typescriptDefinitionFiles = [].concat(
        `${typingsFolder}lib.d.ts`,
        appDefinitionFile
    );

    // Bower files
    const bowerConfig = `${rootFolder}bower.json`;
    const wiredep = require('wiredep');
    const bowerJsFiles = wiredep({devDependencies: true})['js'];

    const appModule = createModule('app');
    const appCommonModule = createModule('app-common');
    const appDemoModule = createModule('app-demo', {
        jsToInject: [
            'layouts/**/*.js',
            '**/*.js'
        ],
    });

    const sharedModule = createModule('shared', {
        folder: 'shared/core',
        jsToInject: [
            'extensions/**/*.js',
            'base-state.js',
            '*.js',
            '**/*.js'
        ],
    });

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

        //Path to the shell file.
        shell: `${clientFolder}index.html`,

        styles: {
            lessToCompile: [
                `${bowerFolder}font-awesome/less/font-awesome.less`,
                `${assetsFolder}less/styles.less`
            ],
            lessToLint: [`${assetsFolder}less/styles.less`],
            lessToWatch: [`${assetsFolder}less/**/*.less`],
            cssToCopy: [],
            cssToInject: [
                `${devBuildStylesFolder}styles.css`,
                `${devBuildStylesFolder}**/*.css`
            ]
        },

        //Global variables
        globals: {
            //File where the global variables are outputted
            file: `${devBuildScriptsFolder}globals.js`,

            //Prefix for all app components
            appComponentPrefix: 'app',

            //Prefix for all shared components
            sharedComponentPrefix: 'shared',

            //Profiles to control the behaviour of the applications
            appProfiles: []
        },

        //Environment-specific config handling
        config: {
            //Path to the environment-specific config data.
            src: `${clientFolder}config.json`,

            //Path to generated script file for the config.
            defaultOutput: `${devBuildScriptsFolder}config.js`,

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
            generatedFiles: `${devBuildScriptsFolder}config*.js`
        },

        //Typescript definition file config
        definitions: {
            //File name of the definition file for application files.
            appFileName: appDefinitionFileName,

            //Path to the definition file for application files.
            appFile: appDefinitionFile,

            //Empty template of the definition file for application files.
            //Contains only the necessary placeholders for the injector.
            appTemplate: `${typingsFolder}app.d.ts.template`,

            //List of all definition files (application, bower, etc.)
            all: typescriptDefinitionFiles
        },

        tslint: [
            {
                description: 'Application script files',
                config: `${toolsFolder}tslint/tslint-app.json`,
                files: modules
                    .filter(mod => mod.name.substr(0, 'app'.length) === 'app')
                    .reduce((files, mod) => files.concat(mod.tsToCompile || `${mod.folder}**/*.ts`), [])
            },
            {
                description: 'Shared module script files',
                config: `${toolsFolder}tslint/tslint-shared.json`,
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
            entryPoint: `${serverFolder}server.js`,
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
            src: `${bowerFolder}bootstrap/dist/fonts/**/*.*`,
            dest: `${cssParentFolder}fonts/`,
            areImages: false
        },
        {
            src: `${bowerFolder}font-awesome/fonts/**/*.*`,
            dest: `${cssParentFolder}fonts/`,
            areImages: false
        },
        {
            src: `${assetsFolder}images/**/*.*`,
            dest: `${cssParentFolder}images/`,
            areImages: true
        },
        {
            src: `${assetsFolder}fonts/*`,
            dest: `${cssParentFolder}fonts/`,
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

    //Creates a module object with defaults for missing values.
    function createModule(moduleName, options) {
        function assignDefaults(name, opts) {
            //Base source folder for the module
            opts.folder = opts.folder || name;

            //List of all Typescript files to compile.
            opts.tsToCompile = opts.tsToCompile || ['**/*.ts'];
            //Additional JavaScript files to copy to the output folder.
            opts.jsToCopy = opts.jsToCopy || [];
            //Folder where the Typescript files are compiled to and the additional JavaScript files are copied to.
            opts.jsOutputFolder = opts.jsOutputFolder || `${devBuildScriptsFolder}${name}/`;
            //All the JavaScript files from the output folder to inject into the shell HTML, in the correct order.
            opts.jsToInject = opts.jsToInject || ['**/*.js'];
            //List of JavaScript files to inject before any other scripts.
            opts.firstInjectJs = opts.firstInjectJs || [
                `${name}.module.js`,
                `config/*.config.js`
            ],

            opts.lessToCompile = opts.lessToCompile || [];
            opts.lessToLint = opts.lessToLint || [];
            opts.lessToWatch = opts.lessToWatch || ['**/*.ts'];
            opts.cssToCopy = opts.cssToCopy || [];

            opts.htmls = opts.htmls || {
                all: '**/*.html',
                root: `/client/${name}`,
                toCache: '**/*.html'
            };

            return opts;
        }

        //Prefixes all string items in an array with the specified prefix.
        function prefixAll(list, prefix) {
            return list.map((item, index, array) => prefix + item);
        }

        //Makes a path a folder path by ensuring it has a trailing slash.
        function makeFolder(folder) {
            return folder[folder.length - 1] === '/' ? folder : folder + '/';
        }

        function makeAbsolutePaths(name, opts) {
            opts.folder = makeFolder(`${clientFolder}${opts.folder}`);

            opts.tsToCompile = prefixAll(opts.tsToCompile, opts.folder);
            //TODO: opts.jsToCopy
            opts.jsOutputFolder = makeFolder(`${devBuildScriptsFolder}${opts.jsOutputFolder}`);
            opts.jsToInject = prefixAll(opts.jsToInject, opts.jsOutputFolder);
            opts.firstInjectJs = prefixAll(opts.firstInjectJs, opts.jsOutputFolder);

            opts.lessToCompile = prefixAll(opts.lessToCompile, opts.folder);
            opts.lessToLint = prefixAll(opts.lessToLint, opts.folder);
            opts.lessToWatch = prefixAll(opts.lessToWatch, opts.folder);
            //TODO: opts.cssToCopy

            opts.htmls.all = `${opts.folder}${opts.htmls.all}`;
            opts.htmls.toCache = `${opts.folder}${opts.htmls.toCache}`;

            return opts;
        }

        options = options || {};
        options.name = moduleName;
        options = assignDefaults(moduleName, options);
        options = makeAbsolutePaths(moduleName, options);
        return options;
    }

    return config;
};
