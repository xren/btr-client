'use strict';

var express = require('express');
var app = express();
var path = require('path');

var feed = require('./lib/feed');

app.set('views', path.join(__dirname, 'public/dist'));
app.engine('html', require('ejs').renderFile);

app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public/dist')));

app.use(feed);

app.listen(3000);
