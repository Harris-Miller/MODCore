const gulp = require('gulp');
const babel = require('gulp-babel');
const rollup = require('rollup');
const del = require('del');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const jscs = require('gulp-jscs');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const file = require('gulp-file');
const path = require('path');

// custom gulp task
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
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
    // .pipe(eslint.failOnError())
    // .pipe(jscs())
});

gulp.task('rollup', ['clean'], function(done) {

  return rollup.rollup({
    entry: 'framework/entry.js'
  }).then(function(bundle) {

    // FUCK! rollup does not support ES7 decorators!!!
    var result = bundle.generate({
      format: 'umd',
      moduleName: 'MODCore',
      dest: 'dist/framework.js'
    });

    // TODO: need to figure out how to add the generated sourcemap in here!
    return file('framework.js', result.code, { src: true })
      .pipe(babel({
        stage: 0,
        externalHelpers: true,
        blacklist: ['es6.modules', 'strict']
      }))
      .pipe(gulp.dest(destinationFolder));
  });

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
    // .pipe(sourcemaps.init())
    .pipe(concat('framework.js'))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('watch', ['lint', 'compile'], function() {
  return gulp.watch(srcFiles, ['lint', 'compile']);
});
