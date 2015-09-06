var gulp = require('gulp'),
    jscheck = require('gulp-jshint'),
    merge = require('merge-stream');
//STRICTLY TEST
gulp.task('jshint', function() {
  var jsCheckModels = gulp.src('./models/*.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var appServer = gulp.src('app.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var routes = gulp.src('routes/*.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var ngApp = gulp.src('public/**/*.js')
    .pipe(jscheck())
    .pipe(jscheck.reporter('jshint-stylish'));

  var jscheckPassport = gulp.src('./config/*.js')
        .pipe(jscheck())
        .pipe(jscheck.reporter('jshint-stylish'));

  var gulpSelf = gulp.src('./gulpfile.js')
      .pipe(jscheck())
      .pipe(jscheck.reporter('jshint-stylish'));

    return merge(jsCheckModels, jscheckPassport, gulpSelf, routes, appServer, ngApp);
});

gulp.task('default', ['jshint']);
