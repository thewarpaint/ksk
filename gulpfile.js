'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    paths = {
      js: ['src/*.js'],
      jsMin: 'watchmen.min.js',
      dist: 'dist'
    };

gulp.task('scripts', function () {
  return gulp.src(paths.js)
    .pipe(concat(paths.jsMin))
    .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
    .pipe(concat.footer('\n})(window, document);\n'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist))
    .pipe(notify({ message: 'Finished concatenating and minifying JavaScript'}));
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['scripts']);
});

gulp.task('build', ['scripts']);
