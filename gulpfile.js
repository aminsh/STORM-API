var path = require('path'),
    fs = require('fs'),
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
    config = {
        isProduction: util.env.production,
        accSrcDir: './accounting/client',
        publicDir: './public',
        vendors: require(`./accounting/client/vendor.path.setting`)
    };

gulp.task('build-template', function () {
    return gulp.src(`${config.accSrcDir}/partials/**/*.html`)
        .pipe(templateCache(
            {
                module: 'acc.module',
                filename: 'acc.template.bundle.js',
                root: 'partials'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));
});

gulp.task('build-acc', function () {
    var bundler = browserify(
        {
            entries: `${config.accSrcDir}/src/acc.config.js`,
            debug: !config.isProduction
        });

    //Object.keys(config.vendors).forEach(key => bundler.external(key));

    bundler
    /*.transform("babelify", {
     presets: ["es2015", "react"]
     })
     .transform({
     global: true,
     mangle: false,
     comments: true,
     compress: {
     angular: true
     }
     }, 'uglifyify');*/
    return bundler.bundle()
        .pipe(exorcist(path.join(`${config.publicDir}/js`, 'acc.bundle.js.map')))
        .pipe(fs.createWriteStream(path.join(`${config.publicDir}/js`, 'acc.bundle.js'), 'utf8'));
});

gulp.task('build-vendor', function () {
    var bundle = browserify({debug: !config.isProduction});

    Object.keys(config.vendors).forEach(key => bundle.require(config.vendors[key], {expose: key}))

    return bundle
        .transform('uglifyify')
        .bundle()
        .pipe(exorcist(path.join(`${config.publicDir}/js`, 'vendor.bundle.min.js.map')))
        .pipe(fs.createWriteStream(path.join(`${config.publicDir}/js`, 'vendor.bundle.min.js'), 'utf8'));
});

gulp.task('build-stimulsoft', function () {
    return gulp.src([
        './vendors/stimulsoft/stimulsoft.reports.js',
        './vendors/stimulsoft/stimulsoft.viewer.js',
        './vendors/stimulsoft/stimulsoft.designer.js'
    ])
        .pipe(beautify({indent_size: 2}))
        .pipe(gulpif(!config.isProduction, sourcemaps.init()))
        .pipe(concat(`stimulsoft.all${config.isProduction ? '.min' : ''}.js`))
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

gulp.task('build-sass', function () {
    return gulp.src('./accounting/client/src/styles/acc.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            //outputStyle: 'compressed',
            includePaths: ['./node_modules']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('acc.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

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


gulp.task('bower', function () {
    return bower({
        cwd: '.',
        interactive: true
    })
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
    'copy-persian-fonts'
]);

gulp.task('default', [
    'bower',
    'build-vendor',
    'build-acc',
    'build-template',
    'copy-assets'
]);

