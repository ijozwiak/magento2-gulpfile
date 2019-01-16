/**
 * Copyright © 2018 Rocket Web
 * See LICENSE.MD for license details.
 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    clean = require('gulp-clean'),
    run = require('gulp-run'),
    browserSync = require('browser-sync').create(),
    sourcemap = require('gulp-sourcemaps'),
    themesConfig = require('./dev/tools/gulp/configs/themes'),
    browserConfig = require('./dev/tools/gulp/configs/browser-sync');

var options = (process.argv.slice(2))[1] ? ((process.argv.slice(2))[1]).substring(2) : Object.keys(themesConfig)[0];

/**
 * Watch for changes
 */

gulp.task('watch', function () {
    var theme = themesConfig[options];

    browserSync.init({
        proxy: browserConfig.proxy
    });

    theme.src.forEach(function (module) {
        gulp.watch([module + '/**/*.less'], ['css']);
    });
});


/**
 * Compile less
 */

gulp.task('css', function () {

    var theme = themesConfig[options],
        filesToCompile = [];

    theme.files.forEach(function (file) {
        filesToCompile.push(
            theme.dest + '/' + theme.locale[0] + '/' + file + '.' + theme.lang
        );
    });

    theme.locale.forEach(function (locale) {
        return gulp
            .src(filesToCompile)
            .pipe(sourcemap.init())
            .pipe(less().on('error', function (error) {
                gutil.log(chalk.red('Error compiling ' + locale + error.message));
            }))
            .pipe(sourcemap.write())
            .pipe(gulp.dest(theme.dest + '/' + locale + '/css'))
            .pipe(browserSync.stream())
            .pipe(gutil.buffer(function () {
                gutil.log(chalk.green('Successfully compiled ' + locale));
            }));
    });
});

/**
 * Browser Sync
 */

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: browserConfig.proxy
    });
});

/**
 * Clean static files
 */

gulp.task('clean-static', function () {

    var theme = themesConfig[options],
        staticFolder = 'pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name;

    var folderToClean = [
        './' + staticFolder + '/*',
        './var/view_preprocessed/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(clean())
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.blue('Clean ' + staticFolder));
            gutil.log(chalk.blue('Clean preprocessed files'));
        }))
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Static files have been cleaned.'));
        }));
});

/**
 * Deploy static assets
 */

gulp.task('deploy', function () {

    var theme = themesConfig[options],
        createAlias = 'bin/magento dev:source-theme:deploy --theme ' + theme.vendor + '/' + theme.name + ' --locale ' + theme.locale[0] + ' ' + theme.files.join(' '),
        staticFolder = 'pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name;

    var folderToClean = [
        './' + staticFolder + '/*',
        './var/view_preprocessed/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(clean())
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.blue('Clean ' + staticFolder));
            gutil.log(chalk.blue('Clean preprocessed files'));
        }))
        .pipe(run(createAlias))
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Deployment finished!'));
        }));
});

/**
 * Deploy static assets
 */

gulp.task('deploy-static', function () {

    var theme = themesConfig[options],
        staticAssetDeploy = 'bin/magento setup:static-content:deploy --theme ' + theme.vendor + '/' + theme.name + ' -v -f',
        staticFolder = 'pub/static/adminhtml/Magento/backend';

    var folderToClean = [
        './' + staticFolder + '/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.blue('Asset static deployment is starting. Wait...'));
        }))
        .pipe(run(staticAssetDeploy).on('error', function (error) {
            gutil.log(chalk.red('Error: ' + error.message));
        }))
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Static deployment finished! Run `gulp watch --[your theme name]`'));
        }));
});

/**
 * Deploy admin assets
 */

gulp.task('deploy-admin', function () {

    var adminAssetsDeploy = 'bin/magento setup:static-content:deploy --theme Magento/backend -v -f',
        staticFolder = 'pub/static/adminhtml/Magento/backend';

    var folderToClean = [
        './' + staticFolder + '/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.blue('Asset static deployment of admin is starting. Wait...'));
        }))
        .pipe(run(adminAssetsDeploy).on('error', function (error) {
            gutil.log(chalk.red('Error: ' + error.message));
        }))
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Admin deployment finished!'));
        }));
});

/**
 * Deploy static assets
 */

gulp.task('deploy-admin', function () {

    var adminAssetsDeploy = 'bin/magento setup:static-content:deploy --theme Magento/backend -v',
        staticFolder = 'pub/static/adminhtml/Magento/backend';

    var folderToClean = [
        './' + staticFolder + '/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.blue('Asset static deployment of admin is starting. Wait...'));
        }))
        .pipe(run(adminAssetsDeploy).on('error', function (error) {
            gutil.log(chalk.red('Error: ' + error.message));
        }))
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Admin deployment finished!`'));
        }));
});

/**
 * Cache clean
 */

gulp.task('clean-cache', function () {

    var folderToClean = [
        './var/page_cache/*',
        './var/cache/*',
        './var/di/*',
        './var/generation/*'
    ];

    return gulp.src(folderToClean, { read: false })
        .pipe(clean())
        .pipe(gutil.buffer(function () {
            gutil.log(chalk.green('Cache cleaned: var/page_cache/ var/cache/ /var/di/ /var/generation/'));
        }))
});


gulp.task('default', ['css']);
