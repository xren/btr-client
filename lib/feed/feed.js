'use strict';

var express = require('express'),
	app = module.exports = express();

app.routes = require('./routes');

app.configure(function () {

	// TODO: post request
	app.get('/api/v1/feed/:feedName/subscribe/:hash', app.routes.subscribeFeed);
	app.get('/api/v1/feed/:feedName', app.routes.getFeed);
	app.get('/api/v1/feed/:feedName/clear', app.routes.clearFeed);
	app.get('/api/v1/feeds', app.routes.showFeedList);
	app.get('/api/v1/feeds/update/new', app.routes.needUpdate);
	app.get('/api/v1/feeds/update/check', app.routes.checkUpdate);
	app.get('/api/v1/secret/get', app.routes.getSecret);
	app.get('/api/v1/feed/:feedAddress/propose', app.routes.proposeFeed);

});