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
    var App = window.App = new AppRouter();
});
