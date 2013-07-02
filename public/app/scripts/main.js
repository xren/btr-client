require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        handlebars: '../bower_components/handlebars/handlebars',

        feedListView: 'views/feedlist.view',
        itemListView: 'views/itemlist.view',
        appRouter: './app.router',
        feedModel: './models/feed.model',
        feedListCollection: './models/feedlist.collection',
        itemModel: './models/item.model',
        itemListCollection: './models/itemlist.collection'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: '$'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'appRouter'
], function ($, Bootstrap, _, Backbone, AppRouter) {
    var globalEvents = {};
    globalEvents = _.extend(globalEvents, Backbone.Events);

    (function worker() {
      $.ajax({
        url: '/api/v1/feeds/update/check', 
        success: function(data) {
            if (data.success) {
                console.log('checking new update');
                if (data.entity.newUpdate) {
                    globalEvents.trigger('global:refresh', 'current');
                }
            } else {
                console.error('error when checking new update', data);
            }
        },
        complete: function() {
          // Schedule the next request when the current one's complete
          setTimeout(worker, 4000);
        }
      });
    })();

    var App = window.App = new AppRouter({
        globalEvents: globalEvents
    });
});
