//var gulp = require('gulp');
//var $    = require('gulp-load-plugins')();
//var autoprefixer = require('autoprefixer');
//var postcss    = require('gulp-postcss');
//var precss = require('precss');
//var Promise = require('es6-promise').Promise;
//var atImport = require('postcss-import');
//var mqpacker = require('css-mqpacker');
//var cssnano = require('cssnano');
//var sassPaths = [
//  'bower_components/foundation-sites/scss',
//  'bower_components/motion-ui/src'
//];
//
//gulp.task('sass-dev', function() {
//var processors = [
//    autoprefixer,
//    precss
//    ];
//  return gulp.src('scss/app.css')
//    .pipe(postcss(processors))
//    .pipe(gulp.dest('public/css'));
//});
//
//gulp.task('sass', function() {
//  return gulp.src('scss/app.scss')
//    .pipe($.sass({
//      includePaths: sassPaths,
//      outputStyle: 'compressed'
//    })
//      .on('error', $.sass.logError))
//    .pipe($.autoprefixer({
//      browsers: ['last 2 versions', 'ie >= 9']
//    }))
//    .pipe(gulp.dest('public/css'));
//});
//
//gulp.task('default', ['sass-dev'], function() {
//  gulp.watch(['scss/**/*.scss'], ['sass-dev']);
//});
//

var jshint = require('gulp-jshint'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync');

var gutil = require('gulp-util');
var Promise = require('es6-promise').Promise;
var postcss = require('gulp-postcss');
var reload  = browserSync.reload;
var simplevars = require('postcss-simple-vars');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var nestedcss = require('postcss-nested');
var corepostcss = require('postcss');
var categories = require('./data/cat-colors.json');

var dataloop = function(css) {
for ( var category in categories.colorList ) {
        var colorSet = categories.colorList[category];
        var borderTop = colorSet[0];
        var borderBottom = colorSet[1];
        var rule = corepostcss.rule({ selector: '.cat-' + category });
        rule.append({ prop: 'border-top', value: '1px solid ' + borderTop});
        rule.append({ prop: 'border-bottom', value: '1px solid ' + borderBottom + ";"});
        css.append(rule);
    }
};

gulp.task('css', function () {
    var processors = [
            autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
            simplevars,
            nestedcss,
            dataloop
            ];

    return gulp.src('preCSS/*.css')
            .pipe(postcss(processors))
            .pipe(gulp.dest('public/css'));
});

//Static server
gulp.task('browser-sync', function() {
        browserSync({
        server: {
        baseDir: "public"
        }
        });
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
            .pipe(concat('all.js'))
            .pipe(gulp.dest('public/js'))
            .pipe(rename('all.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public/js'))
            .pipe(reload({stream:true}));
});

// Images
gulp.task('images', function() {
          return gulp.src('img/**/*')
                 .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
                 .pipe(gulp.dest('public/img'))
                 .pipe(notify({ message: 'Images task complete' }));
});

// Watch
gulp.task('watch', function() {

  // Watch .css files
  gulp.watch('preCSS/**/*.css', ['css', browserSync.reload]);

  // Watch .js files
  gulp.watch(['js/**/*.js','main.js'], ['scripts', browserSync.reload]);

  // Watch image files
  gulp.watch('img/**/*', ['images']);

  // Watch any files in dist/, reload on change
  gulp.watch("*.html", browserSync.reload);

});

gulp.task('default', ['css', 'browser-sync', 'scripts', 'watch']);
