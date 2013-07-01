'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'feedListView',
    'feedListCollection',
    'itemListView',
    'itemListCollection'
], function ($, _, Backbone, FeedListView, FeedListCollection, ItemListView, ItemListCollection) {
    return Backbone.Router.extend({
        $main: '#reader',
        routes: {
            '': 'loadMainView',
            'feed/(:feedName)': 'loadFeedView'
        },

        bind_events: function () {
            this.on('all', console.warn, console);
            this.on('route:loadMainView', this.onLoadMainView, this);
            this.on('route:loadFeedView', this.onLoadFeedView, this);
        },

        initialize: function (options) {
            console.log('INIT: app router');
            this.$main = $('#reader');

            var globalEvents = {};
            _.extend(globalEvents, Backbone.Events);

            this.feedListCollection = new FeedListCollection({globalEvents: globalEvents});
            this.feedListView = new FeedListView({
                collection: this.feedListCollection
            });

            this.itemListCollection = new ItemListCollection({target: 'all', globalEvents: globalEvents});
            this.itemListView = new ItemListView({
                collection: this.itemListCollection,
                globalEvents: globalEvents
            });

            this.bind_events();
            Backbone.history.start();
        },

        onLoadMainView: function () {
            console.log('LOAD: main view');
        },

        onLoadFeedView: function (feedName) {
            console.log('LOAD: feed view', feedName);
            this.itemListCollection.fetch({target: feedName});
        }
    })  
});