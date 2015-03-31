module.exports = function () {
    var assetsFolder = './assets/';
    var bowerFolder = assetsFolder + 'vendor/';
    var appFolder = './app/';
    var typingsFolder = './typings/';

    var devBuildFolder = './.dev/';

    var config = {
        folders: {
            app: appFolder,
            assets: assetsFolder,
            bower: bowerFolder,
            devBuild: devBuildFolder,
            typings: typingsFolder
        },

        index: appFolder + 'index.html',

        files: {
            alljs: appFolder + '**/*.js',
            allless: bowerFolder + '**/*.less',
            less: bowerFolder + 'bootstrap/less/bootstrap.less',
            appjs: [
                devBuildFolder + 'js/App.js',
                devBuildFolder + 'js/**/*.js'
            ],
            appcss: devBuildFolder + '**/*.css',
            appts: [
                typingsFolder + 'tsd.d.ts',
                typingsFolder + 'app.d.ts',
                appFolder + '**/*.ts'
            ],
            htmlTemplates: appFolder + '**/*.html'
        },

        appTsDefinition: typingsFolder + 'app.d.ts',

        wiredepOptions: {
            bowerJson: require('./bower.json'),
            directory: './assets/vendor/',
            ignorePath: '../..'
        },

        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        }
    };

    return config;
};