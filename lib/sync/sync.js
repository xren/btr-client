'use strict';
var assert = require('assert');
var FS = require('q-io/fs');
var util = require('../util');
var q = require('q');

module.exports = (function () {

	var syncPath = 'http://localhost:8888/gui/?';	
	var token = 'BvbAD3bua1SSsYZWcxhHrWWQgYARz-okbBdIfUP-KZBHV7I9Xw5I1ggG0FEAAAAA';
	var syncAction = {
		ADDSYNCFOLDER: 'addsyncfolder'
	};

	return {
		requestAddSyncFolder: function (hash, path) {
			assert(hash !== null || hash !== undefined, 'Incorrect hash');
			assert(path !== null || path !== undefined, 'Incorrect folder name');

			var pathNotFound = function () {
				console.error('Path', path, 'can not be found');
			};

			var generateRequestURL = function () {
				var options = {
					token: token,
					action: syncAction.ADDSYNCFOLDER,
					secret: hash,
					name: path,
					t: new Date().getTime()
				};
				var requestURL = syncPath + util.serializeURL(options);
				console.log('generated request url', requestURL);
				return q.resolve(requestURL);
			};

			var parseResponse = function (response) {
				var defer = q.defer();
				console.log('got response header', response.headers);
				console.log(response.body.read().then(function (data) {
					defer.resolve(data.toString());
				}));
				return defer.promise;
			};

			return FS.isDirectory(path)
				.then(generateRequestURL, pathNotFound)
				.then(util.sendRequest)
				.then(parseResponse);
		}
	}
})();