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
        let tsToCompile = mod.tsToCompile || [`${mod.folder}**/*.ts`];
        let compileTask = gulp.src([].concat(config.definitions.all, tsToCompile))
            .pipe($.typescript({
                typescript: require('typescript'),
                target: config.typescript.targetVersion,
                declarationFiles: false,
                noExternalResolve: false
            }));
        return compileTask.js
            .pipe($.stripLine(`/// <reference path="`))
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

    let cssFiles = config.modules.reduce((result, mod) => result.concat(mod.cssToCopy), config.injections.css);
    let cssSrc = gulp.src(cssFiles, {read: false});

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

////////// Distribution Build Tasks //////////

gulp.task('serve-dist', ['build-dist'], () => {
    serve(false);
});

gulp.task('build-dist', done => {
    log('Building the distribution deployment of the application.');

    sequence('vet',
        'clean_dist',
        'build',
        'create_env_configs',
        'copy_to_dist',
        'inject_ng_templates',
        'optimize_build',
        'copy_webserver_configs_to_dist',
        done);
});

gulp.task('clean_dist', done => {
    clean(config.folders.distBuild, done);
});

gulp.task('create_env_configs', done => {
    if (!config.config.generateEnvs || config.config.generateEnvs.length === 0) {
        done();
        return;
    }

    log('Creating environment-specific config files.');

    let tasks = config.config.generateEnvs.map(env =>
        gulp.src(config.config.src)
            .pipe($.ngConfig(config.config.moduleName, {
                environment: env,
                createModule: false
            }))
            .pipe($.rename(`config.${env}.js`))
            .pipe(gulp.dest(config.folders.devBuildScripts))
    );
    return merge(tasks);
});

gulp.task('inject_ng_templates', ['generate_ng_template_caches'], () => {
    log('Injecting Angular templates caches')
    let task = gulp.src(config.shell)
        .pipe($.plumber());

    task = config.modules.reduce((taskResult, mod) => {
        return taskResult.pipe($.inject(
            gulp.src(`${config.folders.devBuildScripts}${mod.name}/${mod.name}-templates.js` , {read: false}), {
                starttag: `<!-- inject:${mod.name}-templates:js -->`
            }
        ));
    }, task);

    return task.pipe(gulp.dest(config.folders.client));
});

gulp.task('generate_ng_template_caches', () => {
    log('Generating Angular template caches.');

    let tasks = config.modules.map(mod =>
        gulp.src(mod.htmls.toCache)
            .pipe($.minifyHtml({empty: true}))
            .pipe($.angularTemplatecache(`${mod.name}-templates.js`, {
                module: mod.name,
                standAlone: false,
                root: mod.htmls.root
            }))
            .pipe(gulp.dest(config.folders.devBuildScripts + mod.name + '/'))
    );
    return merge(tasks);
});

gulp.task('copy_to_dist', () => {
    log('Copying config, images, fonts and non-cached HTML templates to the dist folder.');
    let configCopyTask = gulp.src(config.config.defaultOutput)
        .pipe(gulp.dest(config.folders.distBuild));
    return merge(getStyleAssetsCopyTasks(
        config.folders.distBuild + 'css/',
        config.folders.distBuild,
        true).concat(configCopyTask));
});

gulp.task('optimize_build', () => {
    log('Performing optimization for dist - bundling, minification and cache busting.');

    let assets = $.useref.assets({searchPath: './'});

    let cssFilter = $.filter('**/*.css', {restore: true});
    let jsLibFilter = $.filter('**/lib.js', {restore: true});
    let jsModulesFilter = $.filter('**/modules.js', {restore: true});

    let task = gulp.src(config.shell)
        .pipe($.plumber())
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        .pipe(jsModulesFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsModulesFilter.restore);
    task = config.modules.reduce((result, mod) => {
        let filter = $.filter(`**/${mod.name}.js`, {restore: true});
        return result.pipe(filter)
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(filter.restore);
    }, task);
    return task
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.folders.distBuild))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.folders.distBuild));
});

gulp.task('copy_webserver_configs_to_dist', () => {
    log('Copying custom web server configurations to the dist folder.');
    var tasks = [];
    for (var webServer in config.webServerConfigs) {
        if (!config.webServerConfigs.hasOwnProperty(webServer)) {
            continue;
        }
        log(`    Found web server: ${webServer}`);
        var cfg = config.webServerConfigs[webServer];
        var task = gulp.src(config.folders.webserver + cfg.src)
            .pipe(gulp.dest(config.folders.distBuild + (cfg.dest || '')));
        tasks.push(task);
    }
    return merge(tasks);
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
        files.concat(mod.tsToCompile || [`${mod.folder}**/*.ts`])
    , []);
    let tsFilesSrc = gulp.src(tsFiles, {read: false});
    return gulp.src(config.definitions.appFile)
        .pipe($.inject(tsFilesSrc, {
            starttag: '//{',
            endtag: '//}',
            transform: filePath => `/// <reference path="..${filePath}" />`
        }))
        .pipe(gulp.dest(config.folders.typings));
});

////////// Serve & watch tasks and helper function //////////

gulp.task('ts_watch_handler', done => {
    sequence('compile_scripts', 'inject_custom_scripts', 'watch_handler_done', done);
});

gulp.task('less_watch_handler', done => {
    sequence('compile_styles', 'inject_custom_scripts', 'watch_handler_done', done);
});

gulp.task('config_watch_handler', done => {
    sequence('create_config', done);
});

gulp.task('watch_handler_done', done => {
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
            let fixedFiles = (mod.tsToCompile || [`${mod.folder}**/*.ts`]).map(ts => startsWith(ts, './') ? ts.substr(2) : ts);
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
        .on('restart', ev => {
            console.log('[nodemon] Restarted ' + ev);
        })
        .on('start', () => {
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
        .on('crash', () => {
            log('[nodemon] Crashed')
        })
        .on('exit', () => {
            log('[nodemon] Exited cleanly')
        });
}

////////// Vetting tasks //////////

gulp.task('vet', done => {
    sequence('generate-app-def',
        'vet_compile_ts', 'vet_lint_ts',
        'vet_compile_less',
        done);
});

gulp.task('vet_compile_ts', () => {
    log('[Vet] Compiling Typescript files');
    let tsToCompile = config.modules.reduce((files, mod) => files.concat(mod.tsToCompile), config.definitions.all);
    return gulp.src(tsToCompile)
        .pipe($.typescript({
            typescript: require('typescript'),
            target: config.typescript.targetVersion,
            declarationFiles: false,
            noExternalResolve: false
        }));
});

let tslintIndex = 0;
gulp.task('vet_lint_ts', done => {
    tslintIndex = 0;
    let tasks = [];
    for (let i = 0; i < config.tslint.length; i++) {
        tasks.push('vet_lint_ts_copy_config');
        tasks.push('vet_lint_ts_run_lint');
        tasks.push('vet_lint_ts_increment_counter');
    }
    tasks.push(done);
    sequence.apply(this, tasks);
});

gulp.task('vet_lint_ts_copy_config', () =>
    gulp.src(config.tslint[tslintIndex].config)
        .pipe($.rename('tslint.json'))
        .pipe(gulp.dest(config.folders.root))
);

gulp.task('vet_lint_ts_run_lint', () => {
    log(config.tslint[tslintIndex].description);
    return gulp.src(config.tslint[tslintIndex].files)
        .pipe($.tslint())
        .pipe($.tslint.report('verbose', {
            emitError: false
        }))
});

gulp.task('vet_lint_ts_increment_counter', done => {
    tslintIndex += 1;
    done();
});

gulp.task('vet_compile_less', () => {
    log('[Vet] Compiling LESS files');
    let lessToCompile = config.modules.reduce((files, mod) => files.concat(mod.lessToCompile), []);
    return gulp.src(lessToCompile)
        .pipe($.less());
});

gulp.task('vet_lint_less', () => {
    log('[Vet] Linting LESS files');
    let lessToLint = config.modules.reduce((files, mod) => files.concat(mod.lessToLint), []);
    return gulp.src(lessToLint)
        .pipe($.lesshint());
});

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
