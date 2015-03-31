'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 7709;
var environment = process.env.NODE_ENV || 'dev';

if (environment === 'dev') {
    app.use('/bower_components', express.static('./bower_components/'));
    app.use('/client/.dev', express.static('./client/.dev/'));
    app.use('/client/app', express.static('./client/app/'));
    app.use('/client/assets', express.static('./client/assets/'));
    app.use('/*', express.static('./client/index.html'));
}

app.listen(port);
