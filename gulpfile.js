/**
 * Copyright © 2019 Rocket Web
 * See LICENSE.MD for license details.
 */

/* Modules */
const gulp = require('gulp'),
    less = require('gulp-less'),
    log = require('fancy-log'),
    chalk = require('chalk'),
    clean = require('gulp-clean'),
    run = require('gulp-run'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    sourcemap = require('gulp-sourcemaps'),
    stylelint = require('gulp-stylelint'),
    postcss = require('gulp-postcss'),
    uncss = require('postcss-uncss'),
    nano = require('cssnano'),
    eslint = require('gulp-eslint'),
    image = require('gulp-image'),
    imageResize = require('gulp-image-resize'),
    parseArgs = require('minimist'),
    copy = require('gulp-copy');

/* Configs */
const themesConfig = require('./dev/tools/gulp/configs/themes'),
    browserConfig = require('./dev/tools/gulp/configs/browser-sync'),
    stylelintConfig = require('./dev/tools/gulp/configs/stylelint'),
    eslintConfig = require('./dev/tools/gulp/configs/eslint');
uncssConfig = require('./dev/tools/gulp/configs/uncss');

/* Theme options and paths */
const args = parseArgs(process.argv.slice(2));
const themeName = args.theme ? args.theme : Object.keys(themesConfig)[0];
const theme = themesConfig[themeName];
const staticFolder = `pub/static/${theme.area}/${theme.vendor}/${theme.name}/${theme.locale}`;
const designFolder = `app/design/frontend/${theme.vendor}/${theme.name}/web`;
const folderToClean = ['./' + staticFolder + '/*', './var/view_preprocessed/*'];

const filesToUnCss = theme.files.map((file) => {
    return (
        `${staticFolder}/${file}.less`
    );
});

const filesToCompile = theme.files.map((file) => {
    return (
        `${staticFolder}/${file}.less`
    );
});

const filesToCopy = theme.files.map((file) => {
    return (
        `${designFolder}/${file}.less`
    );
});

/**
 * Lint less files (excludes _module.less - see config/stylelint.js)
 */
gulp.task('less:lint', function lintCssTask() {
    return gulp
        .src(filesToCopy)
        .pipe(
            stylelint({
                config: stylelintConfig,
                reporters: [{ formatter: 'string', console: true }],
            })
        )
        .on('end', () => {
            log(chalk.green('Less files checked'));
        })
});

/**
 * Copy less to pub/static
 */
gulp.task('less:copy', () => {
    return gulp.src(filesToCopy)
        .pipe(gulp.dest(staticFolder + '/css'));
});

/**
 * Compile less
 */
gulp.task('less:compile', () => {

    return gulp
        .src(filesToCompile)
        .pipe(sourcemap.init())
        .pipe(
            less().on('error', (error) => {
                log(chalk.red(`Error compiling ${theme.vendor}/${theme.name}: ${error.message}`));
            })
        )
        .pipe(sourcemap.write())
        .pipe(gulp.dest(staticFolder + '/css'))
        .pipe(browserSync.stream())
        .on('end', () => {
            log(chalk.green(`Successfully compiled ${theme.vendor}/${theme.name}`));
        })
});

/**
 * unCSS - remove unused css on core pages and generate optimized stylesheets
 */
gulp.task('css:uncss', (done) => {
    const cssFolder = `app/design/frontend/${theme.vendor}/${theme.name}/web/css`;
    const entrypoints = uncssConfig.entrypoints;
    let plugins = []

    entrypoints.forEach(entrypoint => {
        plugins = [
            uncss({
                html: [uncssConfig.baseUrl + entrypoint.path],
                timeout: 5000,
            })
        ]

        return gulp
            .src(filesToUnCss)
            .pipe(postcss(plugins))
            .pipe(rename(path => {
                path.basename += `-${entrypoint.page}`;
                path.extname = '.css';
            }))
            .pipe(gulp.dest(cssFolder))
            .on('end', () => {
                log(
                    chalk.green(
                        `Styles for ${entrypoint.page} have been optimized and saved in ${cssFolder}`
                    )
                );
            });
    });

    done();
});

/**
 * Minify CSS (nano)
 */
gulp.task('css:minify', (done) => {
    const cssFolder = `app/design/frontend/${theme.vendor}/${theme.name}/web/css`;
    const plugins = [
        nano({
            preset: 'default',
        }),
    ];

    return gulp
        .src(staticFolder + '/css/**/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest(cssFolder))
        .on('end', () => {
            log(
                chalk.green(
                    `Styles for have been minified and saved in ${cssFolder}`
                )
            );
        });

    done();
});

/**
 * Lint all JS files in theme folder
 */
gulp.task('js:lint', (done) => {
    const filesToLint = [
        `${designFolder}/**/*.js`,
        '!**/*.min.js',
        '!/**/requirejs-config.js',
    ];

    return gulp
        .src(filesToLint)
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('end', () => {
            log(chalk.green('JS files checked'));
        })

    done();
});

/**
 * Optimize images in theme folder
 */
gulp.task('image:theme:optimize', function (done) {
    const fileTypes = ['png', 'jpg', 'svg'],
        filePaths = fileTypes.map((file) => {
            return designFolder + '/**/*.' + file;
        });

    return gulp
        .src(filePaths)
        .pipe(image())
        .pipe(gulp.dest(themeFolder))
        .on('end', () => {
            log(chalk.green(`Images in ${themeFolder} were optimized`));
        })

    done();
});

/**
 * Optimize specific images in pub/media folder
 * @input {string} - specify input file folder, fallbacks to pub/media
 * @output {string} - specify output file folder, fallbacks to --input (file overrides)
 */
gulp.task('image:media:optimize', function (done) {
    const mediaFolder = 'pub/media';
    const inputFolder = args.input
        ? `${mediaFolder}/${args.input}/**/*`
        : '/**/*';
    const outputFolder = args.output
        ? `${mediaFolder}/${args.output}`
        : `${mediaFolder}/${args.input}`;

    if (!args.input) {
        log(chalk.red('Please specify input folder'));
        done();

        return;
    }

    return gulp
        .src(inputFolder)
        .pipe(image())
        .pipe(gulp.dest(outputFolder))
        .on('end', () => {
            log(chalk.green(`Images in ${inputFolder} were optimized and saved in ${outputFolder}`))
        })

    done();
});

/**
 * Resize specific images
 * @input {string} - specify input blob
 * @output {string} - specify output folder, defaults to pub/media/resized
 * @width {number} - image width in px or percentage
 * @height {number} - image height in px or percentage
 * @crop {bool} - whether image should be cropped, default false
 * @upscale {bool} - whether image can be upscaled, default false
 * @gravity {string: NorthWest|North|NorthEast|West|Center|East|SouthWest|South|SouthEast} - set image gravity when cropping images
 * @format {string: gif|png|jpeg } - override output format of the input file(s)
 * @quality {number} - output quality of the resized image, default 1
 * @background {string} - image bg color if applicable, 'none' to keep transparency
 * @percentage {number} - percentage value of the image size
 * @cover {bool} - maintain aspect ratio by overflowing dimensions when necessary, default false
 */
gulp.task('image:resize', function (done) {
    const options = {
        input: args.input,
        output: args.output || 'pub/media/resized/',
        width: args.width,
        height: args.height,
        crop: args.crop || false,
        upscale: args.upscale || false,
        gravity: args.gravity,
        format: args.format,
        quality: args.quality || 1,
        background: args.background,
        percentage: args.percentage,
        cover: args.cover,
    };

    if (!options.input) {
        log(chalk.red('Please specify input argument'));
        done();

        return;
    }

    if (!options.width) {
        if (!options.height) {
            log(chalk.red('Please specify new image dimensions'));
            done();

            return;
        }
    }

    return gulp
        .src(options.input)
        .pipe(imageResize(options))
        .pipe(gulp.dest(options.output))
        .on('end', () => {
            log(chalk.green(`Images in ${options.input} have been resized and saved in ${options.output}`));
        });

    done();
});


/**
 * Cache clean
 */
gulp.task('clean:cache', function () {
    const cacheFoldersToClean = [
        './var/page_cache/*',
        './var/cache/*',
        './var/di/*',
        './var/generation/*',
    ];

    return gulp
        .src(cacheFoldersToClean, { read: false })
        .pipe(clean())
        .on('end', () => {
            log(chalk.green('Cache cleaned: var/page_cache/ var/cache/ /var/di/ /var/generation/'))
        })
});

/**
 * Clean static files
 */
gulp.task('clean:static', () => {
    return gulp
        .src(folderToClean, { read: false })
        .pipe(clean())
        .on('end', () => {
            log(chalk.green(`Static folder ${staticFolder} have been cleaned`))
        })
});

/**
 * Create aliases in pub/static folder
 */
gulp.task('source', () => {
    const createAlias =
        'php bin/magento dev:source-theme:deploy --theme ' +
        theme.vendor +
        '/' +
        theme.name +
        ' --locale ' +
        theme.locale +
        ' ' +
        theme.files.join(' ');

    return gulp
        .src(staticFolder)
        .on('end', () => {
            log(chalk.blue('Source theme deploy started...'));
        })
        .pipe(run(createAlias))
        .on('end', () => {
            log(chalk.green('Aliases created'));
        })
});

/**
 * Deploy static assets
 */
gulp.task('deploy:static', () => {
    const staticDeploy =
        'php bin/magento setup:static-content:deploy --theme ' +
        theme.vendor +
        '/' +
        theme.name +
        ' -v -f';

    return gulp
        .src(staticFolder)
        .on('end', () => {
            log(chalk.blue('Asset static deployment is starting. Wait...'));
        })
        .pipe(
            run(staticDeploy).on('error', (error) => {
                log(chalk.red('Error: ' + error.message));
            })
        )
        .on('end', () => {
            log(chalk.green('Static deployment finished. Run `gulp watch --[your theme name]`'));
        })
});

/**
 * Deploy admin assets
 */
gulp.task('deploy:admin', () => {
    const adminDeploy = 'php bin/magento setup:static-content:deploy --theme Magento/backend -v -f';

    return gulp
        .src(staticFolder)
        .on('end', () => {
            log(chalk.blue('Asset static deployment of admin is starting. Wait...'));
        })
        .pipe(
            run(adminDeploy).on('error', (error) => {
                log(chalk.red('Error: ' + error.message));
            })
        )
        .on('end', () => {
            log(chalk.green('Admin deployment finished'));
        })
});

/**
 * Watch for changes
 */
gulp.task('serve', () => {
    browserSync.init({
        proxy: browserConfig.proxy,
    });

    return gulp.watch(
        [`pub/static/frontend/${theme.vendor}/${theme.name}/**/*.less`],
        gulp.series('less')
    );
});

/**
 * Task sequences
 */
gulp.task('less', gulp.series('less:lint', 'less:copy', 'less:compile'));
gulp.task('css', gulp.series('css:uncss', 'css:minify'));
gulp.task('js', gulp.series('js:lint'));
gulp.task('refresh', gulp.series('clean:static', 'source', 'less'));
gulp.task('dev', gulp.series('refresh', 'serve'));
gulp.task('build', gulp.series('refresh', 'css'));
