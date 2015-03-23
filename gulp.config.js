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
                appFolder + 'App.js',
                appFolder + '**/*.js'
            ],
            appcss: devBuildFolder + '**/*.css',
            appts: appFolder + '**/*.ts'
        },

        appTsDefinition: typingsFolder + 'app.d.ts',

        wiredepOptions: {
            bowerJson: require('./bower.json'),
            directory: './assets/vendor/',
            ignorePath: '../..'
        }
    };

    return config;
};