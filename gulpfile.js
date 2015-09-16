const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('gulp-rollup');
const esperanto = require('gulp-esperanto');
const del = require('del');
const eslint = require('gulp-eslint');
const jscs = require('gulp-jscs');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const path = require('path');


const es6modules = require('./gulp-es6modules');

const srcFiles = ['framework/**/*.js'];
const manifest = require('./package.json');
const destinationFolder = 'dist';
const exportFilename = 'framework';

gulp.task('clean', function(cb) {
  return del([destinationFolder], cb);
});

gulp.task('lint', function() {
  return gulp.src(srcFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(jscs())
});

gulp.task('compile', ['clean'], function() {
  return gulp.src(srcFiles)
    // .pipe(sourcemaps.init())
    .pipe(babel({
      stage: 0,
      // modules: 'amd',
      // moduleIds: true,
      externalHelpers: true,
      blacklist: ['es6.modules', 'strict']
    }))
    .pipe(es6modules({
      type: 'amd',
      strict: true,
      amdName: 'test',
      absolutePaths: true
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('framework.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('watch', function() {
  return gulp.watch(srcFiles, [/*'lint', */'compile']);
});
