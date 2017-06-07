"use strict";

const path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp'),
    util = require('gulp-util'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    compass = require('gulp-compass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    uglifyify = require('uglifyify'),
    exorcist = require('exorcist'),
    templateCache = require('gulp-angular-templatecache'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    uncss = require('gulp-uncss'),
    beautify = require('gulp-beautify'),
    flatten = require('gulp-flatten'),
    config = {
        isProduction: util.env.production,
        accSrcDir: './accounting/client',
        stormSrcDir: './storm/client',
        publicDir: './public'
    };

gulp.task('acc-build-template', function () {
    return gulp.src([`${config.accSrcDir}/partials/**/*.html`, `${config.accSrcDir}/src/**/*.html`])
        .pipe(templateCache(
            {
                module: 'acc.module',
                filename: 'acc.template.bundle.js',
                root: 'partials'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));
});
gulp.task('minfy', function () {
    return gulp.src('./vendors/kendo/kendo.web.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./vendors/kendo'));
});
gulp.task('acc-build-js', function () {
    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));
            process.exit();
        }

        return browserify(
            {
                entries: `${config.accSrcDir}/src/acc.config.js`,
                debug: true
            })
            .transform({
                global: true,
                mangle: false,
                comments: true,
                compress: {
                    angular: true
                }
            }, 'uglifyify')
            .bundle()
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `acc.bundle.min.map`)))
            .pipe(fs.createWriteStream(path.join(distPath, 'acc.bundle.min.js'), 'utf8')));

        process.exit();
    });
});

gulp.task('acc-build-sass', function () {
    return gulp.src('./accounting/client/src/styles/acc.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('acc.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});

gulp.task('build-stimulsoft', function () {

    let reports = [
        './vendors/stimulsoft/stimulsoft.reports.js',
        './vendors/stimulsoft/stimulsoft.viewer.js'
    ],
        designer = ['./vendors/stimulsoft/stimulsoft.designer.js']
    return gulp.src(config.isProduction ? reports : reports.concat(designer))
        .pipe(beautify({indent_size: 2}))
        .pipe(gulpif(!config.isProduction, sourcemaps.init()))
        .pipe(concat(`stimulsoft.all.min.js`))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(gulp.dest(`${config.publicDir}/js`))
});

gulp.task('css-uncss', function () {
    gulp.src('./content/style.css')
        .pipe(uncss({
            html: ['partials/**/*.html', '../server/views/index.ejs']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-storm-fonts', function () {
    return gulp.src([
        `${config.accSrcDir}/assets/fonts/storm/**.*`,
        `!${config.accSrcDir}/assets/fonts/storm/**.json`
    ])
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-persian-fonts', function () {
    return gulp.src(`${config.accSrcDir}/assets/fonts/persian/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-font-awesome', function () {
    return gulp.src('./node_modules/font-awesome/fonts/**.*')
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-images', function () {
    return gulp.src(`${config.accSrcDir}/assets/images/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/images`));
});

gulp.task('copy-kendo-images', function () {
    return gulp.src(`${config.accSrcDir}/assets/kendo/images/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/images`));
});

gulp.task('copy-kendo-fonts', function () {
    return gulp.src(`${config.accSrcDir}/assets/kendo/fonts/**/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-bootstrap-fonts', function () {
    return gulp.src(`./node_modules/bootstrap-sass/assets/fonts/bootstrap/**/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-stimulsoft-files', function () {
    return gulp.src(`${config.accSrcDir}/assets/fa.xml`)
        .pipe(gulp.dest(`${config.publicDir}`));
});

gulp.task('watch', () => {
    gulp.watch(`${config.accSrcDir}/src/**/*.js`, ['build-acc']);
    gulp.watch(`${config.accSrcDir}/src/**/*.scss`, ['build-sass']);
    gulp.watch(`${config.accSrcDir}/partials/**/*.html`, ['build-template']);
});

gulp.task('beautify', function () {
    return gulp.src('./vendors/stimulsoft/*.js')
        .pipe(beautify({indent_size: 2}))
        .pipe(gulp.dest('./sti/'))
});

gulp.task('copy-assets', [
    'copy-storm-fonts',
    'copy-font-awesome',
    'copy-images',
    'copy-kendo-images',
    'copy-kendo-fonts',
    'copy-bootstrap-fonts',
    'copy-persian-fonts',
    'copy-stimulsoft-files',
    'storm-copy-images'
]);

gulp.task('default', [
    'acc-build-js',
    'acc-build-template',
    'acc-build-sass',
    'build-stimulsoft',
    'storm-build-template',
    'storm-build-js',
    'copy-assets',

]);

gulp.task('storm-build-sass', () => {
    return gulp.src('./storm/client/src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules', './vendors', './shared/styles']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('storm.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));
});

gulp.task('storm-build-template', function () {
    return gulp.src(`${config.stormSrcDir}/src/**/*.html`)
        .pipe(templateCache(
            {
                module: 'app',
                filename: 'storm.template.bundle.js',
                root: 'app'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));
});

gulp.task('storm-build-js', function () {
    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));
            process.exit();
        }

        return browserify(
            {
                entries: `${config.stormSrcDir}/src/app.js`,
                debug: true
            })
            .transform({
                global: true,
                mangle: false,
                comments: true,
                compress: {
                    angular: true
                }
            }, 'uglifyify')
            .bundle()
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `storm.bundle.min.map`))))
            .pipe(fs.createWriteStream(path.join(distPath, 'storm.bundle.min.js'), 'utf8'));

        process.exit();
    });
});

gulp.task('storm-copy-images', function () {
    return gulp.src(`${config.stormSrcDir}/assets/images/**/**.*`)
        .pipe(flatten())
        .pipe(gulp.dest(`${config.publicDir}/images`));
});

