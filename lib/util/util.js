'use strict';
var _ = require('underscore');
var HTTP = require('q-io/http');

module.exports = (function () {

	return {
		sendRequest: function (path, method) {
			var method = method || 'GET';

			var headers = {
				Cookie: 'GUID=thEtYDb6ggf8LrIM5KjT'
			};

			return HTTP.request({
				url: path,
				method: method,
				headers: headers
			});
		},

		serializeURL: function (options) {
			var str = [];
			for (var name in options) {
				str.push(encodeURIComponent(name) + '=' + encodeURIComponent(options[name]));
			}
			return str.join('&');
		}
	}
})();