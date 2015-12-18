var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var postcss    = require('gulp-postcss');
var Promise = require('es6-promise').Promise;
var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

gulp.task('sass-dev', function() {

  return gulp.src('scss/app.scss')
    .pipe(postcss([ require('precss')]))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed'
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
