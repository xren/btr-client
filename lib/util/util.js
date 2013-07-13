'use strict';
var _ = require('underscore');
var HTTP = require('q-io/http');

module.exports = (function () {

	return {
		sendRequest: function (path, method) {
			var method = method || 'GET';

			var headers = {
				Cookie: process.env.SESSION,
				'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
				Host:'localhost:8888',
				Connection:'keep-alive',
				'Accept-Encoding':'gzip,deflate,sdch',
				Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
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