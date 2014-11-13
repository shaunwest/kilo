/**
 * Created by Shaun on 11/9/2014.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');

gulp.task('uglify', function() {
  gulp.src('./march-core.js')
    .pipe(uglify('march-core.min.js', {
      outSourceMap: true,
      sourceRoot: '/marchjs/march-core'
    }))
    .pipe(gulp.dest(''))
});