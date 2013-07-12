'use strict';

var express = require('express');
var app = express();
var path = require('path');

var feed = require('./lib/feed');


app.configure(function () {
    app.set('views', path.join(__dirname, 'public'));
    app.engine('html', require('ejs').renderFile);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(feed);
});

// development only
app.configure('development', function () {
    app.use(express.errorHandler());
});

app.listen(3000);
