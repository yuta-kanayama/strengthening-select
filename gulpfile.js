var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');


/*
## 
*/

gulp.task('css', function(){
  gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'src/config.rb',
      style: 'compressed',
      comments : false,
      css : 'dst',
      sass: 'src/scss',
      sourcemap: false
    }))
    .pipe(gulp.dest('dst'));
});


/*
## 
*/

gulp.task('js', function() {
  gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('strengthening-select.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dst'));
});


/*
## watch
*/

gulp.task('watch', function(){
  livereload.listen();
  
  gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  
  gulp.watch('dst/**/*.html').on('change', livereload.changed);
  gulp.watch('dst/**/*.css').on('change', livereload.changed);
  gulp.watch('dst/**/*.js').on('change', livereload.changed);
});


/*
## task: default
*/

gulp.task('default', ['watch']);

