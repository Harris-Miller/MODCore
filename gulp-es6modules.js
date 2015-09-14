
var gutil = require('gulp-util');
var through = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
var esperanto = require('esperanto');
var path = require('path');
var slash = require('slash');
var objectAssign = require('object-assign');

module.exports = function(opts) {
  opts = opts || { type: 'amd' };

  // amd => toAmd, cjs => toCjs, umd => toUmd
  var fn = 'to' + opts.type.charAt(0).toUpperCase() + opts.type.slice(1).toLowerCase();

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
    var pathParsed = path.posix.parse(file.relative);
    var amdName = path.join(pathParsed.dir, pathParsed.name)
    amdName = slash(amdName);

    try {
      var fileOpts = objectAssign({}, opts, {
        souceMap: !!file.sourceMap,
        sourceMapSource: file.relative,
        sourceMapFile: file.relative,
        amdName: amdName
      });

      var res = esperanto[fn](file.contents.toString(), fileOpts);

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
