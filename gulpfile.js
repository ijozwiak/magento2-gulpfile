/**
 * Copyright © 2020 Rocket Web
 * See LICENSE.MD for license details.
 */

/* Modules */
const gulp = require('gulp'),
  less = require('gulp-less'),
  log = require('fancy-log'),
  chalk = require('chalk'),
  clean = require('gulp-clean'),
  run = require('gulp-run'),
  browserSync = require('browser-sync').create(),
  sourcemap = require('gulp-sourcemaps'),
  stylelint = require('gulp-stylelint'),
  eslint = require('gulp-eslint'),
  image = require('gulp-image'),
  parseArgs = require('minimist');

/* Configs */
const themesConfig = require('./dev/tools/gulp/configs/themes'),
  browserConfig = require('./dev/tools/gulp/configs/browser-sync'),
  stylelintConfig = require('./dev/tools/gulp/configs/stylelint'),
  eslintConfig = require('./dev/tools/gulp/configs/eslint');

/* Theme options and paths */
const args = parseArgs(process.argv.slice(2));
const themeName = args.theme ? args.theme : Object.keys(themesConfig)[0];
const theme = themesConfig[themeName];
const staticFolder = `pub/static/${theme.area}/${theme.vendor}/${theme.name}/${theme.locale}`;
const folderToClean = ['./' + staticFolder + '/*', './var/view_preprocessed/*'];

/**
 * Lint less files (excludes _module.less - see config/stylelint.js)
 */
gulp.task('less:lint', function lintCssTask() {
  const filesToLint = `app/design/frontend/${theme.vendor}/${theme.name}/**/*.less`;

  return gulp
    .src(filesToLint)
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
 * Compile less
 */
gulp.task('less:compile', () => {
  const filesToCompile = theme.files.map((file) => {
    return (
      `pub/static/frontend/${theme.vendor}/${theme.name}/${theme.locale}/${file}.less`
    );
  });

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
 * Lint all JS files in theme folder
 */
gulp.task('js:lint', () => {
  const filesToLint = [
    `app/design/frontend/${theme.vendor}/${theme.name}/**/*.js`,
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
});

/**
 * Optimize images in theme folder
 */
gulp.task('image:theme:optimize', function (done) {
  const themeFolder = `app/design/frontend/${theme.vendor}/${theme.name}`,
    fileTypes = ['png', 'jpg', 'svg'],
    filePaths = fileTypes.map((file) => {
      return themeFolder + '/**/*.' + file;
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
 * Arguments:
 * --input - specify input file folder, fallbacks to pub/media
 * --output - specify output file folder, fallbacks to --input (file overrides)
 */
gulp.task('image:media:optimize', function (done) {
  const mediaFolder = 'pub/media';
  const inputFolder = args.input
    ? `${mediaFolder}/${args.input}/**/*`
    : '/**/*';
  const outputFolder = args.output
    ? `${mediaFolder}/${args.output}`
    : `${mediaFolder}/${args.input}`;

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

  gulp.watch(
    [`pub/static/frontend/${theme.vendor}/${theme.name}/**/*.less`],
    gulp.series('less')
  );
});

/**
 * Task sequences
 */
gulp.task('less', gulp.series('less:compile'));
gulp.task('js', gulp.series('js:lint'));
gulp.task('refresh', gulp.series('clean:static', 'source', 'less'));
gulp.task(
  'theme',
  gulp.series('clean:cache', 'clean:static', 'source', 'less', 'serve')
);
