var gulp = require('gulp');
var config = require('./gulp.config')();
var del = require('del');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('build-dev', [], function() {
    //
});

gulp.task('ts:gen-defs', function() {
    var tsFiles = gulp.src([config.files.appts], {read: false});
    return gulp
        .src(config.appTsDefinition)
        .pipe($.inject(tsFiles, {
            starttag: '//{',
            endtag: '//}',
            transform: function(filePath) {
                return '/// <reference path="../' + filePath + '" />';
            }
        }))
        .pipe(gulp.dest(config.folders.typings));
});

gulp.task('styles', ['clean-styles'], function() {
    log('Converting LESS files to CSS stylesheets');

    return gulp
        .src(config.files.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.folders.devBuild));
});

gulp.task('clean-styles', function(done) {
    var files = config.folders.devBuild + '**/*.css';
    clean(files, done);
});

gulp.task('wiredep', function() {
    log('Injecting script and CSS references');

    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(config.wiredepOptions))
        .pipe($.inject(gulp.src(config.files.appjs)))
        .pipe(gulp.dest(config.folders.app))
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    log('Injecting script and CSS references');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.files.appcss)))
        .pipe(gulp.dest(config.folders.app))
});

gulp.task('serve-dev', ['inject'], function(done) {
    startBrowserSync();
    done();
});

////////////////

function startBrowserSync() {
    if (browserSync.active){
        return;
    }

    log('Starting browser-sync session');

    var options = {
        proxy: 'ng.training:' + 80,
        port: 3000,
        files: [
            config.folders.app + '**/*.*',
            config.folders.assets + '**/*.*'
        ],
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: false
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(options);
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(message) {
    if (typeof(message) === 'object') {
        for (var item in message) {
            if (message.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(message[item]))
            }
        }
    } else {
        $.util.log($.util.colors.blue(message));
    }
}
