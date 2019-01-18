/**
 * Copyright © 2018 Rocket Web
 * See LICENSE.MD for license details.
 */

const gulp = require('gulp'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    clean = require('gulp-clean'),
    run = require('gulp-run'),
    browserSync = require('browser-sync').create(),
    sourcemap = require('gulp-sourcemaps'),
    themesConfig = require('./dev/tools/gulp/configs/themes'),
    browserConfig = require('./dev/tools/gulp/configs/browser-sync');

const options = (process.argv.slice(2))[1] ? ((process.argv.slice(2))[1]).substring(2) : Object.keys(themesConfig)[0];
const theme = themesConfig[options];
const staticFolder = 'pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name + '/' + theme.locale;
const folderToClean = [
    './' + staticFolder + '/*',
    './var/view_preprocessed/*'
];

/**
 * Compile less
 */

gulp.task('less', () => {
    const filesToCompile = theme.files.map((file) => {
        return 'pub/static/frontend/' + theme.vendor + '/' + theme.name + '/' + theme.locale + '/' + file + '.' + theme.lang
    });

    return gulp.src(filesToCompile)
        .pipe(sourcemap.init())
        .pipe(less().on('error', (error) => {
            gutil.log(chalk.red('Error compiling ' + theme.vendor + '/' + theme.name + ': ' + error.message));
        }))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(staticFolder + '/css'))
        .pipe(browserSync.stream())
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Successfully compiled ' + theme.vendor + '/' + theme.name));
        }));
});

/**
 * Clean static files
 */

gulp.task('clean-static', () => {
    return gulp.src(folderToClean, { read: false })
        .pipe(clean())
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.blue('Clean ' + staticFolder));
            gutil.log(chalk.blue('Clean preprocessed files'));
        }))
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Static files have been cleaned.'));
        }));
});

/**
 * Create aliases in pub/static folder
 */

gulp.task('source', () => {

    const createAlias = 'bin/magento dev:source-theme:deploy --theme ' + theme.vendor + '/' + theme.name + ' --locale ' + theme.locale + ' ' + theme.files.join(' ');

    return gulp.src(staticFolder)
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.blue('Source theme deploy started...'));
        }))
        .pipe(run(createAlias))
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Aliases created!'));
        }));
});

/**
 * Deploy static assets
 */

gulp.task('deploy-static', () => {

    const staticDeploy = 'bin/magento setup:static-content:deploy --theme ' + theme.vendor + '/' + theme.name + ' -v -f';

    return gulp.src(staticFolder)
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.blue('Asset static deployment is starting. Wait...'));
        }))
        .pipe(run(staticDeploy).on('error', (error) => {
            gutil.log(chalk.red('Error: ' + error.message));
        }))
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Static deployment finished! Run `gulp watch --[your theme name]`'));
        }));
});

/**
 * Deploy admin assets
 */

gulp.task('deploy-admin', () => {

    const adminDeploy = 'bin/magento setup:static-content:deploy --theme Magento/backend -v -f';

    return gulp.src(staticFolder)
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.blue('Asset static deployment of admin is starting. Wait...'));
        }))
        .pipe(run(adminDeploy).on('error', (error) => {
            gutil.log(chalk.red('Error: ' + error.message));
        }))
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Admin deployment finished!'));
        }));
});

/**
 * Cache clean
 */

gulp.task('cache', function () {

    const cacheFoldersToClean = [
        './var/page_cache/*',
        './var/cache/*',
        './var/di/*',
        './var/generation/*'
    ];

    return gulp.src(cacheFoldersToClean, { read: false })
        .pipe(clean())
        .pipe(gutil.buffer(() => {
            gutil.log(chalk.green('Cache cleaned: var/page_cache/ var/cache/ /var/di/ /var/generation/'));
        }))
});

/**
 * Watch for changes
 */

gulp.task('serve', gulp.series('less', () => {
    browserSync.init({
        proxy: browserConfig.proxy
    });

    gulp.watch(['pub/static/frontend/' + theme.vendor + '/' + theme.name + '/**/*.less'], gulp.series('less'));
}));


gulp.task('default', gulp.series('cache', 'clean-static', 'source', 'less', 'serve'));