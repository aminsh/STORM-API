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
    concat = require('gulp-concat');

gulp.task('build-template', function () {
    return gulp.src('src/app/**/*.html')
        .pipe(templateCache(
            {
                module: 'app',
                filename: 'app.template.bundle.js',
                root: 'app'
            }))
        .pipe(gulp.dest(distPath));
});

gulp.task('build-app', function () {
    var b = browserify(
        {
            entries: "./src/app/app.js",
            debug: true
        });

    /*var vendorPathSetting = require('./vendor.path.setting');
    _.keys(vendorPathSetting).forEach(function (key) {
        b.external(key);
    });*/


    return b
        .transform("babelify", {
            presets: ["es2015", "react"]
        })
        .transform("uglifyify")
        .bundle()
        .pipe(exorcist(path.join(distPath, 'app.bundle.js.map')))
        .pipe(fs.createWriteStream(path.join(distPath, 'app.bundle.js'), 'utf8'));
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


gulp.task('default', ['build-app', 'build-template']);


