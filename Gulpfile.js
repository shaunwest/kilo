/**
 * Created by Shaun on 11/9/2014.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');

gulp.task('uglify', function() {
  gulp.src('./kilo-core.js')
    .pipe(uglify('kilo-core.min.js', {
      outSourceMap: true,
      sourceRoot: '/kilojs/kilo-core'
    }))
    .pipe(gulp.dest(''))
});