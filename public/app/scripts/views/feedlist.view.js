'use strict';

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    return Backbone.View.extend({
        el: $('#feed-list-container'),
        events: {
            'click #feed-list': 'onClickFeedList'
        },
        template: '#tmpl-feed-list-item',
        collection: null,
        initialize: function () {
            console.log(_, Handlebars);
            console.log('INIT: feedlist.view');
            this.bindEvents();
            this.template = Handlebars.compile($(this.template).html());
            console.log('template', this.template);
        },

        bindEvents: function () {
            this.listenTo(this.collection, 'add', this.renderFeedList);
        },

        renderFeedList: function () {
            var collectionJSON = this.collection.toJSON();
            console.log('RENDER: feed list', collectionJSON);
            this.$el.find('#feed-list').html(this.template({feeds: collectionJSON}));
        },

        onClickFeedList: function (event) {
            var me = $(event.target).closest('li');
            $('#feed-list').find('li').removeClass('active');
            me.addClass('active');
        }

    });
});