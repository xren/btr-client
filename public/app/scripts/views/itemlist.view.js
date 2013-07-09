'use strict';

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    return Backbone.View.extend({
        el: $('#item-list-container'),
        templateList: '#tmpl-item-list-item',
        templateHeader: '#tmpl-item-list-header',
        collection: null,
        events: {
            'click #item-list-title-container > .btn': 'onClickClearAll'
        },
        initialize: function (options) {
            console.log('INIT: feedlist.view');
            this.globalEvents = options.globalEvents;
            this.collection = options.collection;
            this.bindEvents();
            this.templateList = Handlebars.compile($(this.templateList).html());
            this.templateHeader = Handlebars.compile($(this.templateHeader).html());
            console.log('template', this.template);
        },

        bindEvents: function () {
            this.listenTo(this.collection, 'items:refresh', this.renderItemList);
        },

        onClickClearAll: function () {
            var self = this;
            $.ajax({
                url: '/api/v1/feed/' + self.collection.target + '/clear',
                success: function (response) {
                    if (response.success) {
                        console.log('clear feed success');
                        self.globalEvents.trigger('global:refresh', self.collection.target);
                    } else {
                        console.error('clear feed failure');
                    }
                }
            })
        },

        renderItemList: function () {
            var collectionJSON = this.collection.toJSON();
            console.log('RENDER: item list', collectionJSON);
            if (collectionJSON.length === 0) {
                collectionJSON = {title: 'No unread content', content: ''};
            } 
            this.$el.find('#item-list').html(this.templateList({items: collectionJSON}));
            this.$el.find('#item-list-title-container').html(this.templateHeader({title: this.collection.target}));
        }
    });
});