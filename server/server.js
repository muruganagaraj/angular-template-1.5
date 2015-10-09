'use strict';

var express = require('express');
var compression = require('compression');
var config = require('../gulp.config.js')();

var app = express();

var port = process.env.PORT || config.server.nodeHostPort;
var environment = process.env.NODE_ENV || 'dev';

var staticOptions = { maxAge: 2592000000 };

if (environment === 'dev') {
    app.use('/bower_components',
        express.static('./bower_components/'));
    app.use('/images',
        express.static('./client/.dev/images/'));
    //Note: we're specifying specific folders under /client because we do
    //not want to expose certain subfolders such as assets (the correct
    //location would be under the .dev folder) and utils.
    for (var i = 0; i < config.modules.length; i++) {
        app.use('/client/' + config.modules[i].name,
            express.static('./client/' + config.modules[i].name + '/'));
    }
    app.use('/client/.dev',
        express.static('./client/.dev/'));
    app.get('/**', function(req, res) {
        res.sendFile('index.html', {
            root: './client/'
        });
    });
} else if (environment === 'dist') {
    app.use(compression());
    app.use('/client',
        express.static('./.dist/client/', staticOptions));
    app.use('/js',
        express.static('./.dist/js/', staticOptions));
    app.use('/css',
        express.static('./.dist/css/', staticOptions));
    app.use('/images',
        express.static('./.dist/images/', staticOptions));
    app.use('/fonts',
        express.static('./.dist/fonts/', staticOptions));
    app.get('/**', function(req, res) {
        res.sendFile('index.html', {
            root: './.dist/'
        });
    });
}

app.listen(port);
