
// !! currently just testing Rollup !!

const modCore = {};

import * as cache from './core/cache';
import Controller from './core/controller';
import CoreObject from './core/core-object';
import ModObject from './core/mod-object';
import * as symbols from './core/symbols';

modCore.core = {
	cache,
	Controller,
	CoreObject,
	ModObject,
	symbols
};

import * as meta from './helpers/meta';
import * as metal from './helpers/metal';
import * as properties from './helpers/properties';
import * as util from './helpers/util';

modCore.helpers = {
	meta,
	metal,
	properties,
	util
};

export default modCore;
