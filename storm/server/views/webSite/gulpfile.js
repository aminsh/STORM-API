"use strict";

const fs = require("fs"),
      path = require("path"),
      gulp = require("gulp"),
      browserify = require("browserify"),
      mkdirp = require("mkdirp"),
      gulpSass = require("gulp-sass"),
      uglifyify = require("uglifyify"),
      sourcemaps = require("gulp-sourcemaps"),
      gulpIf = require("gulp-if"),
      util = require("gulp-util"),
      exorcist = require("exorcist"),
      gulpUglify = require("gulp-uglify"),
      gulpRename = require("gulp-rename"),
      config = {
            isProduction: false,
            publicDir: "."
      };

gulp.task("theme-build-js", () => {

    const distPath = `${config.publicDir}/js`,
          newName = 'home.bundle.min';

    mkdirp(distPath, err => {

        if(err)
            return util.log(util.colors.green.bold(JSON.stringify(err)));

        return browserify({
                entries: `./js/main.js`,
                debug: !config.isProduction
            })
            .bundle()
            .pipe(gulpIf(!config.isProduction, exorcist(path.join(distPath, `${newName}.map`))))
            .pipe(fs.createWriteStream(path.join(distPath, `${newName}.js`)));

    });

});
gulp.task("theme-build-sass", () => {

    const outName = "home.min";

    return gulp.src('./styles/home.scss')
        .pipe(sourcemaps.init())
        .pipe(gulpSass({
            outputStyle: 'compressed',
            includePaths: ['./node_modules']
        }).on('error', gulpSass.logError))
        .pipe(gulpRename(`${outName}.css`))
        .pipe(gulpIf(!config.isProduction, sourcemaps.write()))
        .pipe(gulp.dest(`./css`));

});

gulp.task('default', [
    "theme-build-js",
    "theme-build-sass"
]);