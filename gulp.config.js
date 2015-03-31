module.exports = function () {
    var clientFolder = './client/';
    var appFolder = clientFolder + 'app/';
    var assetsFolder = clientFolder + 'assets/';

    var bowerFolder = './bower_components/';
    var typingsFolder = './typings/';

    var devBuildFolder = clientFolder + '.dev/';
    var distBuildFolder = './.dist/';

    var config = {
        folders: {
            client: clientFolder,
            app: appFolder,
            assets: assetsFolder,
            bower: bowerFolder,
            devBuild: devBuildFolder,
            distBuild: distBuildFolder,
            typings: typingsFolder
        },

        index: clientFolder + 'index.html',
        appTsDefinition: typingsFolder + 'app.d.ts',
        tsdTsDefinition: typingsFolder + 'tsd.d.ts',

        files: {
            alljs: appFolder + '**/*.js',
            allless: bowerFolder + '**/*.less',
            less: bowerFolder + 'bootstrap/less/bootstrap.less',
            appjs: [
                devBuildFolder + 'js/App.js',
                devBuildFolder + 'js/**/*.js'
            ],
            appcss: devBuildFolder + '**/*.css',
            tsToCompile: [
                typingsFolder + 'tsd.d.ts',
                typingsFolder + 'app.d.ts',
                appFolder + '**/*.ts'
            ],
            appts: appFolder + '**/*.ts',
            htmlTemplates: appFolder + '**/*.html'
        },

        wiredepOptions: {
            bowerJson: require('./bower.json')
        },

        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },

        nodeServer: './server/server.js',
        server: './server/',
        port: 7709
    };

    return config;
};