var gulp = require('gulp');
var config = require('./gulp.config')();
var del = require('del');
var args = require('yargs').argv;
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

var port = process.env.PORT || config.server.port;

////////// Task Listing & Default Task //////////

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

////////// Dev Tasks //////////

gulp.task('serve-dev', ['build-dev'], function() {
    serve(true);
});

gulp.task('build-dev', ['clean-dev', 'inject']);

gulp.task('clean-dev', function(done) {
    clean(config.folders.devBuild, done);
});

gulp.task('inject', ['wiredep', 'scripts', 'styles', 'config'], function() {
    log('Injecting local script and CSS references.');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.files.customCss)))
        .pipe($.inject(gulp.src(config.files.appJs)))
        .pipe(gulp.dest(config.folders.client));
});

gulp.task('wiredep', function() {
    log('Wiring up external script dependencies.');

    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(config.wiredepOptions))
        .pipe(gulp.dest(config.folders.client))
});

gulp.task('config', function() {
    log('Generating AngularJS constants file to store configuration.');

    var configEnv = args.env;
    var environment = 'local';
    if (configEnv) {
        environment = configEnv;
    }

    return gulp
        .src(config.config)
        .pipe($.ngConfig('app', {
            environment: environment,
            createModule: false
        }))
        .pipe(gulp.dest(config.folders.devBuild + 'js/'));
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
            .pipe($.babel())
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.folders.devBuild + 'js'))
    ]);
});

gulp.task('clean-scripts', function(done) {
    var files = config.folders.devBuild + '**/*.js';
    clean(files, done);
});

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling LESS files to CSS stylesheets');

    return gulp
        .src(config.files.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(config.folders.devBuild + 'css'));
});

gulp.task('clean-styles', function(done) {
    var files = config.folders.devBuild + '**/*.css';
    clean(files, done);
});

////////// Distribution tasks //////////

gulp.task('serve-dist', ['build-dist'], function() {
    serve(false);
});

gulp.task('build-dist', ['clean-dist', 'build-dev', 'ng-template-cache', 'copy-to-dist'], function () {
    log('Building a distribution build in the .dist folder.');

    var templateCacheFile = config.folders.devBuild + config.templateCache.file;
    var templateCacheSrc = gulp.src(templateCacheFile, {read: false});
    var templateCacheOptions = {
        starttag: '<!-- inject:template:js -->'
    };

    var assets = $.useref.assets({searchPath: './'});

    var cssFilter = $.filter('**/*.css');
    var jsFilter = $.filter('**/*.js');

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(templateCacheSrc, templateCacheOptions))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.folders.distBuild))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.folders.distBuild));
});

gulp.task('clean-dist', function(done) {
    clean(config.folders.distBuild, done);
});

gulp.task('copy-to-dist', function () {
    log('Copying images, fonts and non-cached HTML templates to the dist folder.');

    /** Enable only if we're not pre-caching all templates **/
    //return gulp
    //    .src(config.files.htmlTemplates)
    //    .pipe(gulp.dest(config.folders.distBuild + 'client/app/'));

    return gulp
        .src(config.files.glyphiconFonts)
        .pipe($.plumber())
        .pipe(gulp.dest(config.folders.distBuild + 'fonts/'));
});

gulp.task('ng-template-cache', function() {
    log('Generating Angular template cache.');

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

gulp.task('tslint', [], function () {
    return gulp
        .src(config.files.tsToCompile)
        .pipe($.tslint())
        .pipe($.tslint.report('verbose'));
});

gulp.task('ts-gen-defs', function() {
    log('Generating a single Typescript definition file (app.d.ts) for all custom Typescript files.');

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

gulp.task('bump', function () {
    var message = 'Bumping versions ';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        message += 'to ' + version;
    } else {
        options.type = type;
        message += 'for a ' + type;
    }
    log(message);

    return gulp
        .src(config.files.packagesForVersionBump)
        .pipe($.bump(options))
        .pipe(gulp.dest(config.folders.root));
});

gulp.task('create-git-hooks', function () {
    log('Creating GIT hooks.')
    return gulp
        .src('./.pre-commit')
        .pipe($.symlink('./.git/hooks/pre-commit', {force: true}));
});

////////// Helper Functions //////////

function serve(isDev) {
    var nodeOptions = {
        script: config.server.entryPoint,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'dist'
        },
        watch: [config.server.watch]
    };
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            console.log('Restarted ' + ev);
            if (isDev) {
                setTimeout(function () {
                    browserSync.notify('Reloading now...');
                    browserSync.reload({stream: false});
                }, 1000);
            }
        })
        .on('start', function() {
            console.log('Started');
            if (isDev) {
                startBrowserSync();
            }
        })
        .on('crash', function() {
            console.log('Crashed')
        })
        .on('exit', function() {
            console.log('Exited cleanly')
        });
}

function startBrowserSync(serverPort) {
    if (args.nosync || browserSync.active){
        return;
    }

    log('Starting browser-sync session');

    gulp.watch(config.files.tsToCompile, ['scripts']);
    gulp.watch(config.files.less, ['styles']);

    var options = {
        proxy: 'localhost:' + port,
        port: config.server.browserSyncPort,
        files: [
            config.folders.app + '**/*.*',
            config.folders.assets + '**/*.*',
            '!' + config.folders.app + '**/*.js',
            '!' + config.folders.app + '**/*.js.map'
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
        logPrefix: 'browser-sync',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(options);
}

function clean(path, done) {
    log('Cleaning: ' + path);
    del(path, done);
}

function log(message) {
    if (typeof(message) === 'object') {
        for (var item in message) {
            if (message.hasOwnProperty(item)) {
                $.util.log($.util.colors.bgYellow(message[item]))
            }
        }
    } else {
        $.util.log($.util.colors.bgYellow(message));
    }
}
