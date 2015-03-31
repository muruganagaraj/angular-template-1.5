var gulp = require('gulp');
var config = require('./gulp.config')();
var del = require('del');
var args = require('yargs').argv;
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

var port = process.env.PORT || config.port;

////////// Dev Tasks //////////

gulp.task('serve-dev', ['build-dev'], function() {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': 'dev'
        },
        watch: [config.server]
    };
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            console.log('Restarted ' + ev);
            setTimeout(function() {
                browserSync.notify('Reloading now...');
                browserSync.reload({stream: false});
            }, 1000);
        })
        .on('start', function() {
            console.log('Started');
            startBrowserSync();
        })
        .on('crash', function() {
            console.log('Crashed')
        })
        .on('exit', function() {
            console.log('Exited cleanly')
        });
});

gulp.task('build-dev', ['clean-dev', 'inject'], function(done) {
    done();
});

gulp.task('clean-dev', function(done) {
    clean(config.folders.devBuild, done);
});

gulp.task('inject', ['wiredep', 'scripts', 'styles'], function() {
    log('Injecting script and CSS references');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.files.appcss)))
        .pipe($.inject(gulp.src(config.files.appjs)))
        .pipe(gulp.dest(config.folders.client));
});

gulp.task('wiredep', function() {
    log('Injecting script and CSS references');

    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(config.wiredepOptions))
        .pipe(gulp.dest(config.folders.client))
});

gulp.task('scripts', ['clean-scripts'], function() {
    log('Transpiling Typescript code to Javascript');

    var tsResult = gulp
        .src(config.files.tsToCompile)
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            target: 'ES6',
            declarationFiles: false,
            noExternalResolve: false
        }));

    var merge = require('merge2');
    return merge([
        tsResult.dts.pipe(gulp.dest(config.folders.devBuild + 'js')),
        tsResult.js
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.folders.devBuild + 'js'))
    ]);
});

gulp.task('clean-scripts', function(done) {
    var files = config.folders.devBuild + '**/*.js';
    clean(files, done);
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

////////// Distribution tasks //////////

gulp.task('ng-template-cache', function() {
    log('Generating Angular template cache');

    gulp
        .src(config.files.htmlTemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.folders.devBuild))
});

////////// Misc Tasks //////////

gulp.task('ts-gen-defs', function() {
    var tsFiles = gulp.src([config.files.appts], {read: false});
    return gulp
        .src(config.appTsDefinition)
        .pipe($.inject(tsFiles, {
            starttag: '//{',
            endtag: '//}',
            transform: function(filePath) {
                return '/// <reference path="..' + filePath + '" />';
            }
        }))
        .pipe(gulp.dest(config.folders.typings));
});

////////////////

function startBrowserSync() {
    if (args.nosync || browserSync.active){
        return;
    }

    log('Starting browser-sync session');

    var options = {
        proxy: 'localhost:' + port,
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
