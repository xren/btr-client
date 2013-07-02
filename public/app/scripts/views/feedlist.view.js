'use strict';

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    return Backbone.View.extend({
        el: $('#reader'),
        events: {
            'click #feed-list': 'onClickFeedList',
            'click #feed-add button': 'onClickFeedAdd'
        },
        template: '#tmpl-feed-list-item',
        collection: null,
        initialize: function (options) {
            this.globalEvents = options.globalEvents;
            console.log('INIT: feedlist.view');
            this.bindEvents();
            this.template = Handlebars.compile($(this.template).html());
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
        },

        onClickFeedAdd: function (event) {
            event.preventDefault();
            var feedAddress = $('#feed-add > input').val();
            var self = this;
            $.ajax({
                url: '/api/v1/feed/'+encodeURIComponent(feedAddress)+'/propose',
                success: function (data) {
                    self.globalEvents.trigger('global:refresh', 'all');
                }
            });
            $('#feed-add > input').val('');
        }

    });
});