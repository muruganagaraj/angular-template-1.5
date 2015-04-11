module.exports = function () {
    var rootFolder = './';

    var clientFolder = rootFolder + 'client/';
    var appFolder = clientFolder + 'app/';
    var assetsFolder = clientFolder + 'assets/';

    var bowerFolder = rootFolder + 'bower_components/';
    var typingsFolder = rootFolder + 'typings/';

    var devBuildFolder = clientFolder + '.dev/';
    var distBuildFolder = rootFolder + '.dist/';

    var appTypescriptFiles = appFolder + '**/*.ts';

    var bowerJsonFile = rootFolder + 'bower.json';
    var tsdTsDefinitionFile = typingsFolder + 'tsd.d.ts';
    var appTsDefinitionFile = typingsFolder + 'app.d.ts';

    var config = {
        folders: {
            root: rootFolder,
            client: clientFolder,
            app: appFolder,
            assets: assetsFolder,
            bower: bowerFolder,
            devBuild: devBuildFolder,
            distBuild: distBuildFolder,
            typings: typingsFolder
        },

        index: clientFolder + 'index.html',
        config: clientFolder + 'config.json',
        tsdTsDefinition: tsdTsDefinitionFile,
        appTsDefinition: appTsDefinitionFile,

        files: {
            less: [
                bowerFolder + 'bootstrap/less/bootstrap.less',
                assetsFolder + 'css/styles.less'
            ],
            appJs: [
                devBuildFolder + 'js/App.js',
                devBuildFolder + 'js/config.js',
                devBuildFolder + 'js/**/*.js'
            ],
            customCss: devBuildFolder + 'css/**/*.css',
            tsToCompile: [
                tsdTsDefinitionFile,
                appTsDefinitionFile,
                appTypescriptFiles,
                '!' + appFolder + 'App.config.ts'
            ],
            appts: appTypescriptFiles,
            htmlTemplates: appFolder + '**/*.html',
            packagesForVersionBump: [
                rootFolder + 'package.json',
                bowerJsonFile
            ],
            glyphiconFonts: bowerFolder + 'bootstrap/dist/fonts/**/*.*'
        },

        wiredepOptions: {
            bowerJson: require(bowerJsonFile),
            ignorePath: '..'
        },

        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                standAlone: false,
                root: '/client/app/'
            }
        },

        server: {
            entryPoint: rootFolder + 'server/server.js',
            watch: rootFolder + 'server/',
            port: 7709,
            browserSyncPort: 8209
        }
    };

    return config;
};