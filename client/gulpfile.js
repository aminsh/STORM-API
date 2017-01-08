var path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    uglifyify = require('uglifyify'),
    exorcist = require('exorcist'),
    distPath = './dist',
    templateCache = require('gulp-angular-templatecache'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    css_bundle = require('gulp-bundle-assets');

gulp.task('build-template', function () {
    return gulp.src('partials/**/*.html')
        .pipe(templateCache(
            {
                module: 'acc.module',
                filename: 'acc.template.bundle.js',
                root: 'partials'
            }))
        .pipe(gulp.dest(distPath));
});

gulp.task('build-acc', function () {
    var b = browserify(
        {
            entries: "./src/acc.config.js",
            debug: true
        });

    var vendorPathSetting = require('./vendor.path.setting');
    _.keys(vendorPathSetting).forEach(function (key) {
        b.external(key);
    });


    return b
        .transform("babelify", {
            presets: ["es2015", "react"]
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
        .pipe(exorcist(path.join(distPath, 'acc.bundle.js.map')))
        .pipe(fs.createWriteStream(path.join(distPath, 'acc.bundle.js'), 'utf8'));
});

gulp.task('build-vendor', function () {
    var b = browserify(
        {
            debug: true
        });

    var vendorPathSetting = require('./vendor.path.setting');
    _.keys(vendorPathSetting).forEach(function (key) {
        console.log(key);
        b.require(vendorPathSetting[key], {expose: key});
    });

    return b
        .transform('uglifyify')
        .bundle()
        .pipe(exorcist(path.join(distPath, 'vendor.bundle.min.js.map')))
        .pipe(fs.createWriteStream(path.join(distPath, 'vendor.bundle.min.js'), 'utf8'));
});

gulp.task('compress-stimulsoft', function () {
    gulp.src(['./lib/stimulsoft.reports.js', './lib/stimulsoft.viewer.js', './lib/stimulsoft.designer.js'])
        .pipe(concat('stimulsoft.all.min.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist'))
});

gulp.task('css-bundle', function () {
    gulp.src('./bundle.config.js')
        .pipe(css_bundle())
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['build-acc', 'build-template']);

