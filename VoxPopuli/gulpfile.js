var gulp = require('gulp'),
    jscheck = require('gulp-jshint');

gulp.task('jshint', function() {
  var jscheckModels = gulp.src('./models/**/*.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var  jscheckPassport = gulp.src('./config/*.js')
        .pipe(jscheck())
        .pipe(jscheck.reporter('jshint-stylish'));

    return merge(jscheckModels, jscheckPassport)
});

gulp.task('default', ['jshint']);
