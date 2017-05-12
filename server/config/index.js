'use strict';

let path = require('path');
let _ = require('lodash');

global.rootPath = path.normalize(path.join(__dirname, '..', '..'));

module.exports = {
    isDevMode() {
		return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
	}, 
	isProductionMode() {
		return process.env.NODE_ENV === 'production';
	},
	isTestMode() {
		return process.env.NODE_ENV === 'test';
	}
};

let baseConfig = require("./base");
module.exports = _.defaultsDeep(baseConfig, module.exports);
