'use strict';

var express = require('express'),
	app = module.exports = express();

app.routes = require('./routes');

app.configure(function () {

	app.get('/api/v1/feed/:feedName/subscribe/:hash', app.routes.subscribe);

});