"use strict";

const path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp'),
    util = require('gulp-util'),
    gulpif = require('gulp-if'),
    gulpforeach = require('gulp-foreach'),
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
        publicDir: './public',
        adminDir: './admin/client',
        invoiceDir: './invoice/client',
        thirdPartyDir: './third-party/client',
        campaignDir: './campaign/client',
        campaignPrefix: 'camp-',
        docsDir: './documents/client',
        docsPrefix: 'docs-'
    },
    nodemon = require('gulp-nodemon');

gulp.task('admin-build-template', function () {

    return gulp.src([
        `${config.adminDir}/**/*.html`,
        `${config.accSrcDir}/partials/templates/content-template.html`,
        `${config.accSrcDir}/partials/templates/grid-template.html`,
        `${config.accSrcDir}/partials/templates/grid-filter-template.html`,
        `${config.accSrcDir}/partials/templates/paging-template.html`,
        `${config.accSrcDir}/partials/templates/content-template.html`
    ])
        .pipe(templateCache(
            {
                module: 'admin.module',
                filename: 'admin.template.bundle.js',
                root: 'partials/templates'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));
});

gulp.task('admin-build-js', function () {
    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));

        }

        return browserify(
            {
                entries: `./admin/app.client.config.js`,
                debug: !config.isProduction
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
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `admin.bundle.min.map`)))
                .pipe(fs.createWriteStream(path.join(distPath, 'admin.bundle.min.js'), 'utf8')));

        process.exit();
    });
});

gulp.task('admin-build-sass', function () {
    return gulp.src('./shared/styles/admin.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules', './accounting/client/src/styles']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('admin.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});

// [START] SMRSAN
gulp.task('admin-build-ckeditor', function () {
    return gulp.src(`./vendors/ckeditor/**/*.*`)
        .pipe(gulp.dest(`${config.publicDir}/js/ckeditor`));
});
// [-END-] SMRSAN

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

gulp.task('storm-build-sass', () => {
    return gulp.src('./storm/client/src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules', './vendors', './shared/styles', './accounting/client/src/styles']
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
                debug: !config.isProduction
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

gulp.task('invoice-build-template', function () {
    return gulp.src([
        `${config.accSrcDir}/src/report/reportPrint.html`,
        `${config.invoiceDir}/**/*.html`,
        `${config.accSrcDir}/partials/templates/content-template.html`])
        .pipe(templateCache(
            {
                module: 'invoice.module',
                filename: 'invoice.template.bundle.js',
                root: 'partials/templates'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));
});

gulp.task('invoice-build-js', function () {
    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));

        }

        return browserify(
            {
                entries: `./invoice/app.client.config.js`,
                debug: !config.isProduction
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
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `invoice.bundle.min.map`)))
                .pipe(fs.createWriteStream(path.join(distPath, 'invoice.bundle.min.js'), 'utf8')));

        process.exit();
    });
});
gulp.task('invoice-build-sass', function(){

    return gulp.src('./shared/styles/invoice.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('invoice.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});

// [START] SMRSAN
gulp.task('thirdParty-build-template', function(){

    return gulp.src([`${config.thirdPartyDir}/**/*.html`])
        .pipe(templateCache(
            {
                module: 'thirdParty.module',
                filename: 'thirdParty.template.bundle.js',
                root: 'partials/templates'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));

});
gulp.task('thirdParty-build-js', function(){

    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));

        }

        return browserify(
            {
                entries: `./third-party/app.client.config.js`,
                debug: !config.isProduction
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
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `thirdParty.bundle.min.map`)))
                .pipe(fs.createWriteStream(path.join(distPath, 'thirdParty.bundle.min.js'), 'utf8')));

        process.exit();
    });

});
gulp.task('thirdParty-build-sass', function(){

    return gulp.src('./shared/styles/third-party.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('thirdParty.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});
gulp.task('thirdParty-docs-copy-images', function () {
    return gulp.src(`${config.thirdPartyDir}/docs/assets/images/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/docs/images`));
});

gulp.task('campaign-build-template', function(){

    return gulp.src([`${config.campaignDir}/**/*.html`])
        .pipe(templateCache(
            {
                module: 'campaign.module',
                filename: 'campaign.template.bundle.js',
                root: 'partials/templates'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));

});
gulp.task('campaign-build-js', function(){

    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));
        }

        return browserify(
            {
                entries: `./campaign/app.client.config.js`,
                debug: !config.isProduction
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
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `campaign.bundle.min.map`)))
                .pipe(fs.createWriteStream(path.join(distPath, 'campaign.bundle.min.js'), 'utf8')));

        process.exit();
    });

});
gulp.task('campaign-build-sass', function (){

    return gulp.src('./shared/styles/campaign.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules', './accounting/client/src/styles']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('campaign.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});
gulp.task('campaign-copy-images', function () {
    return gulp.src(`${config.campaignDir}/assets/images/**.*`)
        .pipe(gulpforeach(function(stream, file){
            let fileProps = path.parse(file.path);
            return stream
                .pipe(rename(config.campaignPrefix + fileProps.name + fileProps.ext))
                .pipe(gulp.dest(`${config.publicDir}/images`));
        }));
});

// DOCS

gulp.task('docs-build-template', function(){

    return gulp.src([`${config.docsDir}/**/*.html`])
        .pipe(templateCache(
            {
                module: 'docs.module',
                filename: 'docs.template.bundle.js',
                root: 'partials/templates'
            }))
        .pipe(gulp.dest(`${config.publicDir}/js`));

});
gulp.task('docs-build-js', function(){

    const distPath = `${config.publicDir}/js`;

    mkdirp(`${config.publicDir}/js`, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));
        }

        return browserify(
            {
                entries: `./documents/app.client.config.js`,
                debug: !config.isProduction
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
            .pipe(gulpif(!config.isProduction, exorcist(path.join(distPath, `docs.bundle.min.map`)))
                .pipe(fs.createWriteStream(path.join(distPath, 'docs.bundle.min.js'), 'utf8')));

        process.exit();
    });

});
gulp.task('docs-build-sass', function (){

    return gulp.src('./shared/styles/docs.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules', './accounting/client/src/styles']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('docs.min.css'))
        .pipe(gulp.dest(`${config.publicDir}/css`));

});
gulp.task('docs-copy-images', function () {
    return gulp.src(`${config.docsDir}/assets/images/**.*`)
        .pipe(gulpforeach(function(stream, file){
            let fileProps = path.parse(file.path);
            return stream
                .pipe(rename(config.docsPrefix + fileProps.name + fileProps.ext))
                .pipe(gulp.dest(`${config.publicDir}/images`));
        }));
});
// [-END-] SMRSAN

gulp.task('minfy', function () {
    return gulp.src('./vendors/kendo/kendo.web.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./vendors/kendo'));
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

gulp.task('copy-mdi-fonts', function () {
    return gulp.src(`./vendors/storm-lumx/css/libs/mdi/fonts/**.*`)
        .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('copy-stimulsoft-files', function () {
    return gulp.src(`${config.accSrcDir}/assets/fa.xml`)
        .pipe(gulp.dest(`${config.publicDir}`));
});

gulp.task('watch', () => {
    //gulp.watch(`${config.stormSrcDir}/src/!**!/!*.html`, ['storm-build-template']);
    gulp.watch(`${config.accSrcDir}/src/!**!/!*.js`, ['build-acc']);
    gulp.watch(`${config.accSrcDir}/src/!**!/!*.scss`, ['build-sass']);
    gulp.watch(`${config.accSrcDir}/partials/!**!/!*.html`, ['build-template']);
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
    'copy-mdi-fonts',
    'copy-persian-fonts',
    'copy-stimulsoft-files',
    'storm-copy-images',
    'thirdParty-docs-copy-images',
    'campaign-copy-images',
    'docs-copy-images'
]);

gulp.task('default', [
    'admin-build-template',
    'admin-build-js',
    'admin-build-sass',
    'acc-build-js',
    'acc-build-template',
    'acc-build-sass',
    'build-stimulsoft',
    'storm-build-template',
    'storm-build-js',
    'copy-assets',
    'invoice-build-template',
    'invoice-build-js',
    'invoice-build-sass',
    'thirdParty-build-template',
    'thirdParty-build-js',
    'thirdParty-build-sass',
    'campaign-build-template',
    'campaign-build-js',
    'campaign-build-sass',
    'docs-build-template',
    'docs-build-js',
    'docs-build-sass',
    'admin-build-template',
    'admin-build-js'
]);

gulp.task('run-server', function () {
    var env = require('./eviroment.json');

    nodemon({
        script: 'index.js'
        , ext: 'js html'
        , env: env//{ 'NODE_ENV': 'development' }
    });
});

