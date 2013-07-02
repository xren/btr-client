'use strict';

var sync = require('../sync');
var FeedParser = require('feedparser'),
    request = require('request');
var observer = require('../observer');
var FS = require('q-io/fs');
var feedObserver = observer.load('feed');
var path = require('path');
var q = require('q');

module.exports = (function () {
    var feedDict = {};
    var feedRoot = path.join(__dirname, '../../feed');

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
