var gulp = require('gulp')
var pug = require('gulp-pug')
var less = require('gulp-less')
var minifyCSS = require('gulp-csso')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
var rm = require('rimraf')

gulp.task('html', function(){
  return gulp.src('src/templates/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist/html'))
});

gulp.task('css', function(){
  return gulp.src('src/templates/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'))
});

gulp.task('js', function(){
  return gulp.src('src/javascript/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
});

gulp.task('rev', function () {
  return gulp.src(['rev/**/*.json', 'dist/**/*.html'])
    .pipe( revCollector({
      replaceReved: true,
      dirReplacements: {
        'css': '../css',
        'js': '../js',
        'cdn/': function(manifest_value) {
          return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value
        }
      }
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('clean', function () {
  rm.sync('@(dist|rev)')
})

gulp.task('default', [ 'html', 'css', 'js' ])
