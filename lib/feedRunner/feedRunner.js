'use strict';

var sync = require('../sync');
var FeedParser = require('feedparser'),
    request = require('request');
var observer = require('../observer');
var FS = require('q-io/fs');
var feedObserver = observer.load('feed');
var path = require('path');
var q = require('q');
var Twit = require('twit');

var T = new Twit({
    'consumer_key': 'UqycisIuVkMPU1GeBKWcvw',
    'consumer_secret': 'M7GrSrKa2RjflQXPr35NYcgqSWqr7xRXWuVwOdsfM',
    'access_token': '22503932-rNhKwRZaHx737LuCo48Gp9oFDwLwejmvszxa7uc2g',
    'access_token_secret': '3CiYVfHimwo2jUBmf6t1Ht7zmyQzxojfvM2DOo9QyU'
});

module.exports = (function () {
    var feedDict = {};
    var feedRoot = path.join(__dirname, '../../feed');

    feedObserver.on('newTwitterFeed', function (query) {
        T.get('search/tweets', { q: query, count: 30 }, function (err, reply) {
            var defer = q.defer();
            var tweets = reply.statuses;
            var folderName = 'item';

            var getFeedDirectory = function (i) {
                return function () {
                    var fName = folderName + i.toString();
                    return path.join(feedRoot, query, fName);
                }
            };

            var getfullPath = function (feedDirectory) {
                return function () {
                    return path.join(feedDirectory, process.env.CONTENT_FILENAME);
                }
            };
            var promises = [];

            for (var i = 0; i < tweets.length; i++) {
                var feedDirectory = getFeedDirectory(i)();
                promises.push(FS.makeDirectory(feedDirectory));
            }

            q.all(promises)
                .done(function () {
                    for (var j = 0; j < tweets.length; j++) {
                        var tweet = tweets[j];
                        var username = tweet.user.name;
                        var text = '<div>' + tweet.text + '</div>';
                        var content = JSON.stringify({
                            title: username,
                            content: text
                        });
                        var feedDirectory = getFeedDirectory(j)();
                        var contentPath = getfullPath(feedDirectory)();
                        console.log(contentPath);
                        FS.write(contentPath, content)
                            .then(function () {
                                console.log('feed update');
                            })
                    }
                });

        });
    });

    feedObserver.on('newFeed', function (address, hostname) {
        console.log('got new feed nofitifcation');
        var folderName = 'item';
        var count = 1;

        request(address)
            .pipe(new FeedParser())
            .on('error', function (err) {
                console.error(err);
            })
            .on('meta', function (meta) {
                console.log('feed meta', meta);
            })
            .on('readable', function () {
                var stream = this, item;
                count++;

                while(item = stream.read()) {
                    var fName = folderName + count.toString();
                    var feedDirectory = path.join(feedRoot, hostname, fName);
                    var content = JSON.stringify({
                        title: item.title,
                        content: item.description
                    });
                    FS.makeDirectory(feedDirectory)
                        .then(function () {
                            var contentPath = path.join(feedDirectory, process.env.CONTENT_FILENAME);
                            FS.write(contentPath, content)
                                .then(function () {
                                    console.log('feed update');
                                })
                        })
                }
            });
    });

    return {
        subscribe: function (res, feedAddress) {
            sync.getSecret()
                .then(function (data) {
                    var payload = JSON.parse(data);
                    var rosecret = payload.rosecret;
                    res.redirect('/api/v1/feed/test/subscribe/'+rosecret);
                });
        }
    }
})();
