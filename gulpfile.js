'use strict';

let gulp = require('gulp');
let config = require('./gulp.config')();
let del = require('del');
let args = require('yargs').argv;
let sequence = require('run-sequence');
let merge = require('merge2');
let $ = require('gulp-load-plugins')({lazy: true});

let port = process.env.PORT || config.server.nodeHostPort;

////////// Task Listing & Default Task //////////

gulp.task('help', $.taskListing.withFilters(/_/, task => task === 'default' || task === 'help'));

gulp.task('default', ['serve']);

////////// Dev Build Tasks //////////

gulp.task('serve', ['build'], () => {
    serve(true);
});

gulp.task('build', done => {
    sequence('clean_dev',
        'generate_shell_html',
        ['inject_bower_scripts', 'compile_scripts', 'compile_styles'],
        'create_config',
        ['inject_custom_scripts', 'copy_static_to_dev'],
        done);
});

gulp.task('clean_dev', done => {
    clean(config.folders.devBuild, done);
});

gulp.task('generate_shell_html', done => {
    log('Generating the index.html file.');
    sequence('delete_shell_html', 'copy_shell_html_template', done);
});

gulp.task('delete_shell_html', done => {
    clean(config.shell, done);
});

gulp.task('copy_shell_html_template', () =>
    gulp.src(config.folders.client + 'index.html.template')
        .pipe($.rename('index.html'))
        .pipe(gulp.dest(config.folders.client))
);

gulp.task('inject_bower_scripts', () => {
    log('Wiring up Bower script dependencies.');

    let wiredep = require('wiredep').stream;
    return gulp.src(config.shell)
        .pipe(wiredep(config.wiredepOptions))
        .pipe(gulp.dest(config.folders.client))
});

gulp.task('compile_scripts', ['generate-app-def'], () => {
    log('Transpiling Typescript code to JavaScript');

    let tasks = config.modules.map(mod => {
        let compileTask = gulp.src([].concat(config.definitions.all, mod.tsToCompile))
            .pipe($.typescript({
                typescript: require('typescript'),
                target: config.typescript.targetVersion,
                declarationFiles: false,
                noExternalResolve: false
            }));
        return compileTask.js
            .pipe(gulp.dest(mod.jsOutputFolder));
    });
    return merge(tasks);
});

gulp.task('compile_styles', () => {
    log('Compiling LESS files to CSS stylesheets');

    let tasks = config.modules.map(mod =>
        gulp.src(mod.lessToCompile)
            .pipe($.plumber())
            .pipe($.less())
            .pipe(gulp.dest(config.folders.devBuildStyles))
    );
    return merge(tasks);
});

gulp.task('create_config', () => {
    log('Generating AngularJS constants file to store environment-specific configuration.');

    let environment = args.env || config.config.defaultEnv;
    return gulp.src(config.config.src)
        .pipe($.ngConfig(config.config.moduleName, {
            environment: environment,
            createModule: false
        }))
        .pipe(gulp.dest(config.folders.devBuildScripts));
});

gulp.task('inject_custom_scripts', () => {
    log('Injecting local script and CSS references.');

    let configSrc = gulp.src(config.config.defaultOutput);
    let configOptions = {
        starttag: '<!-- inject:config:js -->'
    };

    let cssSrc = gulp.src(config.injections.css, {read: false});

    let firstJsSrc = gulp.src(config.injections.firstJs);

    let injectTask = gulp.src(config.shell)
        .pipe($.inject(configSrc, configOptions))
        .pipe($.inject(cssSrc))
        .pipe($.inject(firstJsSrc));

    let jsSrc, jsOptions;
    config.modules.forEach(mod => {
        jsSrc = gulp.src([].concat(
            mod.jsToInject,
            config.exclude(config.injections.firstJs)
        ));
        jsOptions = {
            starttag: '<!-- inject:' + mod.name + ':js -->'
        };
        injectTask = injectTask
            .pipe($.inject(jsSrc, jsOptions));
    });
    injectTask = injectTask.pipe(gulp.dest(config.folders.client));
    return injectTask;
});

gulp.task('copy_static_to_dev', () => {
    log('Copying static JavaScript, CSS and style asset files to dev build folder.');

    let jsCssTasks = config.modules.reduce((tsks, mod) => {
        if (!!mod.jsToCopy) {
            tsks.push(gulp.src(mod.jsToCopy)
                .pipe(gulp.dest(mod.jsOutputFolder))
            );
        }
        if (!!mod.cssToCopy) {
            tsks.push(gulp.src(mod.cssToCopy)
                .pipe(gulp.dest(config.folders.devBuildStyles))
            );
        }
        return tsks;
    }, []);
    let assetTasks = getStyleAssetsCopyTasks(
        config.folders.devBuildStyles,
        config.folders.devBuild,
        false
    );
    return merge(jsCssTasks.concat(assetTasks));
});

////////// App definition file generation tasks //////////

gulp.task('generate-app-def', done => {
    log(`Generating a single Typescript definition file (${config.definitions.appFileName}) for all custom Typescript files.`);
    sequence('app_def_delete',
        'app_def_copy_template',
        'app_def_generate',
        done);
});

gulp.task('app_def_delete', done => {
    clean(config.definitions.appFile, done);
});

gulp.task('app_def_copy_template', () =>
    gulp.src(config.definitions.appTemplate)
        .pipe($.rename(config.definitions.appFileName))
        .pipe(gulp.dest(config.folders.typings))
);

gulp.task('app_def_generate', () => {
    let tsFiles = config.modules.reduce((files, mod) =>
        files.concat(mod.tsToCompile)
    , []);
    let tsFilesSrc = gulp.src(tsFiles, {read: false});
    return gulp.src(config.definitions.appFile)
        .pipe($.inject(tsFilesSrc, {
            starttag: '//{',
            endtag: '//}',
            transform: function(filePath) {
                return '/// <reference path="..' + filePath + '" />';
            }
        }))
        .pipe(gulp.dest(config.folders.typings));
});

////////// Serve & watch tasks and helper function //////////

gulp.task('ts_watch_handler', function(done) {
    sequence('compile_scripts', 'inject_custom_scripts', 'watch_handler_done', done);
});

gulp.task('less_watch_handler', function(done) {
    sequence('compile_styles', 'inject_custom_scripts', 'watch_handler_done', done);
});

gulp.task('config_watch_handler', function(done) {
    sequence('create_config', done);
});

gulp.task('watch_handler_done', function(done) {
    log('Changes handled! Please reload browser.', $.util.colors.bgGreen);
    done();
});

function serve(isDev) {

    function startsWith(str, checkStr) {
        if (!checkStr) {
            return true;
        }
        if (checkStr.length > str.length) {
            return false;
        }
        return str.indexOf(checkStr) === 0;
    }

    //Before serving, keep watch for changes to any Typescript or LESS files, so they are
    //automatically recompiled. This applies only to DEV mode.
    //Note: There is an issue with gulp.watch that prevents it from detecting new or deleted files
    //if the glob is absolute or starts with './'. Hence the code below to fix it.
    //See: http://stackoverflow.com/a/26851844
    if (isDev) {
        let tsToWatch = config.modules.reduce((files, mod) => {
            let fixedFiles = mod.tsToCompile.map(ts => startsWith(ts, './') ? ts.substr(2) : ts);
            return files.concat(fixedFiles);
        }, []);
        gulp.watch(tsToWatch, ['ts_watch_handler']);
        let lessToWatch = config.modules.reduce((files, mod) => {
            let fixedFiles = mod.lessToWatch.map(less => startsWith(less, './') ? less.substr(2) : less);
            return files.concat(fixedFiles);
        }, []);
        gulp.watch(lessToWatch, ['less_watch_handler']);
        gulp.watch(config.config.src, ['config_watch_handler']);
    }

    let launch = args.launch;

    let open = require('open');

    //If the customHost option is specified, assume that an external web server
    //is already set-up on the config.server.customHostPort port and simply open
    //the browser on that port.
    let customHost = args.customHost;
    if (customHost) {
        if (launch) {
            open('http://localhost:' + config.server.customHostPort);
        }
        return;
    }

    let nodeOptions = {
        script: config.server.entryPoint,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'dist'
        },
        watch: ['./server/server.js']
    };
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            console.log('[nodemon] Restarted ' + ev);
        })
        .on('start', function() {
            log('[nodemon] Starting on port ' + port);
            if (launch || (typeof launch !== 'undefined')) {
                if (launch === 1) {
                    open('http://localhost:' + port);
                } else if (typeof launch === 'string') {
                    open('http://localhost:' + port + launch);
                }
            } else {
                open('http://localhost:' + port);
            }

        })
        .on('crash', function() {
            log('[nodemon] Crashed')
        })
        .on('exit', function() {
            log('[nodemon] Exited cleanly')
        });
}

////////// Helper functions //////////

function getStyleAssetsCopyTasks(cssFolder, cssParentFolder, optimizeImages) {
    let assets = config.getStyleAssets(cssFolder, cssParentFolder);
    let gulpTasks = assets.map(asset => {
        let gulpTask = gulp.src([].concat(asset.src)).pipe($.plumber());
        //TODO: Issue with image-min. Revisit.
        //if (asset.areImages && optimizeImages) {
        //    gulpTask = gulpTask.pipe($.imagemin({optimizationLevel: 4}));
        //}
        return gulpTask.pipe(gulp.dest(asset.dest));
    });
    return gulpTasks;
}

function clean(path, done) {
    log('Cleaning: ' + path);
    del(path);
    done(); //TODO: Bug with current version of del that prevents passing done as the second parameter.
}

function log(message, color) {
    if (!color) {
        color = $.util.colors.bgBlue;
    }
    if (typeof(message) === 'object') {
        for (let item in message) {
            if (message.hasOwnProperty(item)) {
                $.util.log(color(message[item]))
            }
        }
    } else {
        $.util.log(color(message));
    }
}
