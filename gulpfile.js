var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var babel = require('gulp-babel');
var derequire = require('gulp-derequire');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var BUILD = 'browser';
var DIST = './';
var VERSION = require('./package.json').version;

var FULL_HEADER = (
  '/**\n' +
  ' * SocketCluster JavaScript client v' + VERSION + '\n' +
  ' */\n');

gulp.task('browserify', function() {
  var stream = browserify({
      builtins: ['_process', 'events', 'buffer', 'querystring'],
      entries: 'index.js',
      standalone: 'socketCluster'
    })
    .ignore('_process')
    .bundle();
  return stream.pipe(source('socketcluster.js'))
    .pipe(derequire())
    .pipe(insert.prepend(FULL_HEADER))
    .pipe(gulp.dest(DIST));
});

gulp.task('minify', function() {
  return gulp.src(DIST + 'socketcluster.js')
    .pipe(babel({
      comments: false
    }))
    .pipe(babel({
      plugins: ["minify-dead-code-elimination"]
    }))
    .pipe(uglify())
    .pipe(insert.prepend(FULL_HEADER))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(DIST))
});