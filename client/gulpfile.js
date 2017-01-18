var gulp = require('gulp')
var inject = require('gulp-inject')
var bower = require('gulp-bower')
var bowerFiles = require('main-bower-files')

gulp.task('bower', function() {
  return bower({
    cwd: '.',
    interactive: true
  })
})

gulp.task('inject:bower', ['bower'], () => {
  return gulp.src('content/index.ejs')
    .pipe(
      inject(
        gulp.src(
          bowerFiles(
            {
              paths: {
                bowerJson: 'bower.json',
                bowerDirectory: 'lib/'
              }
            }),
          {read: false}
        ),
      {
        name: 'bower',
        addPrefix: '/client',
        removeTags: true
      })
    )
  .pipe(gulp.dest('../server/views/'))
})
