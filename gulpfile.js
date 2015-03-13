/**
 * Created by Shaun on 11/9/2014.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma').server;
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var karmaConfig = __dirname + '/karma.conf.js';

/*gulp.task('clean', function() {
  return gulp.src('kilo.min.js', {read: false})
    .pipe(clean());
});*/

gulp.task('build', function() {
  return gulp.src('kilo2.js')
    .pipe(uglify())
    .pipe(rename('kilo.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('test', function(cb) {
  return karma.start({
    configFile: karmaConfig,
    singleRun: true
  }, cb);
});

gulp.task('watch', function() {
  return gulp.watch('kilo.js', ['build']);
});

gulp.task('ci', function(cb) {
  return karma.start({
    configFile: karmaConfig
  }, cb);
});

gulp.task('default', function(cb) {
  //runSequence('test', 'clean', 'build', 'watch', cb);
  runSequence('test', 'build', 'watch', cb);
});
