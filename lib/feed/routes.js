'use strict';
var FS = require('q-io/fs');
var path = require('path');
var sync = require('../sync');
var q = require('q');
var _ = require('underscore');
var feedRunner = require('../feedRunner');
var observer = require('../observer');
var url = require('url');

var feedObserver = observer.load('feed');

module.exports = (function () {

    var feedRoot = path.join(__dirname, '../../feed');
    var newUpdates = true;

    var generateSuccessPayload = function (entity) {
        return {
            success: true,
            entity: entity
        }
    };

    var generateFailurePayload = function (message) {
        return {
            success: false,
            message: message
        }
    };

    var sendSuccess = function (res, entity) {
        var payload = generateSuccessPayload(entity);
        res.json(payload);
    };

    var sendError = function (res, code, err) {
        var payload = generateFailurePayload(err.message);
        res.json(code, payload);
    };

    var listFeeds = function (root) {
        var root = root || feedRoot;
        return FS.list(root)
                .then(function (list) {
                    for (var i=0; i<list.length; i++) {
                        var element = list[i];
                        if (element === '.DS_Store') {
                            list.splice(i, 1);
                        }
                    }
                    return q.resolve(list);
                });
    };

    var listFeedItems = function (feedPath) {
        return FS.list(feedPath)
                .then(function (items) {
                    var itemList = [];
                    for (var i in items) {
                        var value = items[i];
                        if (value.indexOf('.Sync') === -1 && value.indexOf('DS_Store') === -1) {
                            itemList.push(path.join(feedPath, value));
                        }
                    }
                    return q.resolve(itemList);
                });
    };

    var flatArray = function (array) {
        var result = [];
        for (var i in array) {
            if (array[i] instanceof Array) {
                for (var j in array[i]) {
                    result.push(array[i][j]);
                }
            } else {
                result.push(array[i]);
            }
        }
        return result;
    };

    return {
        getSecret: function (req, res) {
            sync.getSecret().then(function (data) {
                sendSuccess(res, data);
            });
        },

        needUpdate: function (req, res) {
            newUpdates = true;
            sendSuccess(res, {});
        },

        checkUpdate: function (req, res) {
            var options = {};
            options.newUpdate = newUpdates;
            sendSuccess(res, options);
        },

        proposeFeed: function (req, res) {
            var feedAddress = req.params.feedAddress;
            if (feedAddress.indexOf('twitter') !== -1) {
                var query = feedAddress.split(':')[1];
                sync.getSecret()
                    .then(function (data) {
                        var payload = JSON.parse(data);
                        var rosecret = payload.rosecret;
                        res.redirect('/api/v1/feed/'+query+'/subscribe/'+rosecret);
                        feedObserver.emit('newTwitterFeed', query);
                    });
            } else if (feedAddress.length === 33) {
                console.log('IS SECRET');
                    res.redirect('/api/v1/feed/'+feedAddress.substring(0, 5)+'/subscribe/'+feedAddress);
            } else {
                console.log('IS ADDRESS');
                sync.getSecret()
                    .then(function (data) {
                        var payload = JSON.parse(data);
                        var rosecret = payload.rosecret;
                        var hostname = url.parse(feedAddress).hostname;
                        res.redirect('/api/v1/feed/'+hostname+'/subscribe/'+rosecret);
                        feedObserver.emit('newFeed', feedAddress, hostname);
                    });
            }
        },
        
        subscribeFeed: function (req, res) {
            var feedName = req.params.feedName,
                hash = req.params.hash;

            var feedPath = path.join(feedRoot, feedName);

            var makeAddSyncFolderRequest = function () {
                console.log('ready to make add sync folder request');
                return sync.requestAddSyncFolder(hash, feedPath);
            };

            var errorMakeDirectory = function (e) {
                console.log('error when making directory', e);
                return q.reject({
                    message: 'makeDirectory Error. Directory exist'
                });
            };

            var parseResponse = function (body) {
                console.log('response', body);
                try {
                    var payload = JSON.parse(body);
                    if (payload.error === 0) {
                        return q.resolve();
                    } else {
                        return q.reject(payload);
                    }
                }
                catch (err) {
                    return q.reject(err);
                }
            };

            FS.makeDirectory(feedPath)
                .then(makeAddSyncFolderRequest, errorMakeDirectory)
                .then(parseResponse)
                .fail(_.partial(sendError, res, 400))
                .done(_.partial(sendSuccess, res));
        },

        getFeed: function (req, res) {
            var feedName = req.params.feedName;
            var feedPath = path.join(feedRoot, feedName);

            var fileGuard = function (path, stat) {
                if (stat.node.nlink === 3) {
                    return true;
                }
                return false;
            };

            var listItem = function () {
                if (feedName === 'all') {
                    return listFeeds(feedRoot)
                        .then(function (feeds) {
                            console.log('feeds', feeds);
                            var promises = [];
                            for (var i in feeds) {
                                var name = feeds[i];
                                var feedPath = path.join(feedRoot, name);
                                promises.push(listFeedItems(feedPath)
                                    .then(function (items) {
                                        return q.resolve(items);
                                    }));
                            }
                            return q.all(promises);
                        });
                } else {
                    return listFeedItems(feedPath);
                }
            };

            var aggregateItemContent = function (itemList) {
                if (feedName === 'all') {
                    itemList = flatArray(itemList);
                }

                var contentList = [];
                _.each(itemList, function (itemPath) {
                    var contentPath = path.join(itemPath, process.env.CONTENT_FILENAME);
                    contentList.push(FS.read(contentPath)
                        .then(function (content) {
                            var contentInfo = JSON.parse(content);
                            return q.resolve({
                                title: contentInfo.title,
                                content: contentInfo.content || ''
                            });
                        })
                    );
                });
                return q.all(contentList);
            };

            listItem(feedPath)
                .then(aggregateItemContent)
                .then(_.partial(sendSuccess, res),
                      _.partial(sendError, res, 400));
        },

        clearFeed: function (req, res) {
            var feedName = req.params.feedName;
            var feedPath = path.join(feedRoot, feedName);

            listFeedItems(feedPath)
                .then(function (paths) {
                    var promises = [];
                    console.log('paths', paths);
                    for (var i in paths) {
                        var path = paths[i];
                        promises.push(FS.removeTree(path));
                    }
                    return q.all(promises);
                })
                .then(_.partial(sendSuccess, res),
                      _.partial(sendError, res, 400));
        },

        showFeedList: function (req, res) {
            var sendFeedList = function (feedList) {
                res.json(generateSuccessPayload(feedList));
            };

            var sendGetFeedList = function (err) {
                res.json(400, generateFailurePayload(err.message));
            };

            var fileGuard = function (path, stat) {
                console.log(path, stat.node.nlink);
                if (stat.node.nlink < 2) {
                    return false;
                }

                var excludeGroup = ['SyncTrash', 'SyncID', 'SyncIgnore', 'DS_Store'];
                for (var exclude in excludeGroup) {
                    if (path.indexOf(exclude) !== -1) {
                        return false;
                    }
                }

                console.log('success', path);
                return true;
            };


            var generateFeedStats = function (feedList) {
                var statsPromiseList = [];
                _.each(feedList, function (feed) {
                    statsPromiseList.push(listFeedItems(path.join(feedRoot, feed))
                        .then(function (items) {
                            return q.resolve({
                                name: feed,
                                unread: items.length
                            });
                        }));
                });
                return q.all(statsPromiseList);
            };

            listFeeds(feedRoot)
                .then(generateFeedStats)
                .then(_.partial(sendSuccess, res),
                      _.partial(sendError, res, 400));
        }
    }
})();