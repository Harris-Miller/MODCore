'use strict';

const gutil = require('gulp-util');
const through = require('through2');
const applySourceMap = require('vinyl-sourcemaps-apply');
const esperanto = require('esperanto');
const path = require('path');
const slash = require('slash');

module.exports = function(opts) {
  opts = opts || { type: 'amd' };

  // amd => toAmd, cjs => toCjs, umd => toUmd
  let fn = 'to' + opts.type.charAt(0).toUpperCase() + opts.type.slice(1).toLowerCase();

  // file = 
  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-es6modules'), 'Streaming is not currently supported');
      return;
    }

    // path.pasix so the join happens always with '/' and not '\\' on windows machines
    let pathParsed = path.posix.parse(file.relative);
    let amdName = path.join(pathParsed.dir, pathParsed.name)
    amdName = slash(amdName);

    try {
      let fileOpts = Object.assign({}, opts, {
        souceMap: !!file.sourceMap,
        sourceMapSource: file.relative,
        sourceMapFile: file.relative,
        amdName
      });

      let res = esperanto[fn](file.contents.toString(), fileOpts);

      if (file.sourceMap && res.map) {
        applySourceMap(file, res.map);
      }

      file.contents = new Buffer(res.code);
      this.push(file);
    }
    catch (err) {
      this.emit('error', new gutil.PluginError('gulp-es6modules', err, {fileName: file.path}));
    }

    cb();
  });
}
