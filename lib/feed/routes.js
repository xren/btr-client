'use strict';
var FS = require('q-io/fs');
var path = require('path');
var sync = require('../sync');
var q = require('q');

module.exports = (function () {

	var feedRoot = path.join(__dirname, '../../feed');

	return {
		subscribe: function (req, res) {
			var feedName = req.params.feedName,
				hash = req.params.hash;

			var feedPath = path.join(feedRoot, feedName);

			var makeAddSyncFolderRequest = function () {
				console.log('ready to make add sync folder request');
				return sync.requestAddSyncFolder(hash, feedPath);
			};

			var errorMakeDirectory = function (e) {
				console.log('error when making directory', e);
				return q.resolve();
			}

			FS.makeDirectory(feedPath)
				.then(makeAddSyncFolderRequest, errorMakeDirectory)
				.done(function () {
					res.send('done');
				});


		}
	}
})();