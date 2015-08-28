var gulp = require('gulp'),
    jscheck = require('gulp-jshint'),
    merge = require('merge-stream');
//STRICTLY TEST
gulp.task('jshint', function() {
  var jscheckModels = gulp.src('./models/**/*.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var  jscheckPassport = gulp.src('./config/*.js')
        .pipe(jscheck())
        .pipe(jscheck.reporter('jshint-stylish'));

  var gulpSelf = gulp.src('./gulpfile.js')
      .pipe(jscheck())
      .pipe(jscheck.reporter('jshint-stylish'));

    return merge(jscheckModels, jscheckPassport, gulpSelf);
});

gulp.task('default', ['jshint']);
