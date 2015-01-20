var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    growl = require('gulp-notify-growl'),
    phpunit = require('gulp-phpunit');

var paths = {
    'dev': {
        'less': './resources/assets/less/',
        'js': './resources/assets/js/',
        'vendor': './resources/assets/vendor/'
    },
    'production': {
        'css': './public/assets/css/',
        'js': './public/assets/js/'
    }
};

// CSS
gulp.task('css', function() {
  return gulp.src(paths.dev.less+'app.less')
    .pipe(less())
    .pipe(gulp.dest(paths.production.css))
  //should add in uncss here to remove unused selectors
    .pipe(minify({keepSpecialComments:0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.production.css));
});

// JS
gulp.task('js', function(){
  return gulp.src([
      paths.dev.vendor+'angular/angular.js',
      paths.dev.vendor+'angular-bootstrap/ui-bootstrap.js',
      paths.dev.js+'controllers.js',
      paths.dev.js+'app.js',
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.production.js));
});

// PHP Unit
gulp.task('phpunit', function() {
  var options = {debug: false, notify: true};
  return gulp.src('./tests/*.php')
    .pipe(phpunit('./vendor/bin/phpunit', options))

    .on('error', notify.onError({
      title: 'PHPUnit Failed',
      message: 'One or more tests failed.'
    }))

    .pipe(notify({
      title: 'PHPUnit Passed',
      message: 'All tests passed!'
    }));
});

gulp.task('watch', function() {
    gulp.watch(paths.dev.less + '/*.less', ['css']);
    gulp.watch(paths.dev.js + '/*.js', ['js']);
    gulp.watch('./tests/*.php', ['phpunit']);
});

gulp.task('default', ['css', 'js', 'phpunit', 'watch']);
