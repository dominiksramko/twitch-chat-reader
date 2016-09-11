var fs = require('fs'),
    del = require('del'),
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    uglify = require('gulp-uglify');

gulp.task('cleanup', function() {
    return del('dist/**/*');
});

gulp.task('templates', function() {
  return gulp
    .src(['src/templates/*.pug'])
    .pipe(pug({
        client: true,
        debug: false,
        compileDebug: false,
        }))
    .pipe(footer(';module.exports=template;'))
    .pipe(gulp.dest('dist/templates/'));
});

gulp.task('prepare', ['templates'], function() {
  return gulp
    .src(['src/**/*'])
    .pipe(gulp.dest('dist/'));
});

// TODO: .pipe(uglify())
gulp.task('scripts', ['prepare'], function() {
  return gulp
    .src('dist/js/index.js')
    .pipe(browserify())
    .pipe(concat('tcr.js'))
    .pipe(header('(function() {'))
    .pipe(footer('}());'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/**/*', ['default']);
});

gulp.task('default', ['scripts']);