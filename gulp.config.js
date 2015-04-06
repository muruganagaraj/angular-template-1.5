module.exports = function () {
    var rootFolder = './';
    var clientFolder = './client/';
    var appFolder = clientFolder + 'app/';
    var assetsFolder = clientFolder + 'assets/';

    var bowerFolder = './bower_components/';
    var typingsFolder = './typings/';

    var devBuildFolder = clientFolder + '.dev/';
    var distBuildFolder = './.dist/';

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
        tsdTsDefinition: tsdTsDefinitionFile,
        appTsDefinition: appTsDefinitionFile,

        files: {
            less: [
                bowerFolder + 'bootstrap/less/bootstrap.less',
                assetsFolder + 'css/styles.less'
            ],
            appJs: [
                devBuildFolder + 'js/App.js',
                devBuildFolder + 'js/**/*.js'
            ],
            customCss: devBuildFolder + 'css/**/*.css',
            tsToCompile: [
                tsdTsDefinitionFile,
                appTsDefinitionFile,
                appTypescriptFiles
            ],
            appts: appTypescriptFiles,
            htmlTemplates: appFolder + '**/*.html',
            packagesForVersionBump: [
                rootFolder + 'package.json',
                bowerJsonFile
            ]
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
            entryPoint: './server/server.js',
            watch: './server/',
            port: 7709,
            browserSyncPort: 8209
        }
    };

    return config;
};