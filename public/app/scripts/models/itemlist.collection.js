'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'itemModel'
], function ($, _, Backbone, ItemModel) {
	return Backbone.Collection.extend({
		model: ItemModel,
		url: function () {
			return '/api/v1/feed/';
		},
		
		initialize: function (options) {
			console.log('INIT: itemlist collection');
            this.fetch({target: options.target});
            this.globalEvents = options.globalEvents;
            this.bindEvents();
		},

		fetch: function (options) {
			var self = this;
			this.target = options.target;
			console.log('item target', self.target);
			$.ajax({
				url: '/api/v1/feed/' + self.target,
				success: function (response) {
					console.log('response items', response);
					if (response.success) {
						self.set(response.entity);
						self.trigger('items:refresh');
					}
				}
			});
		},

        bindEvents: function () {
        	var self = this;
        	this.globalEvents.on('global:refresh', function (target) {
        		self.fetch({target: target});
        	}, this);
            // this.on('add', function () {console.log('model add');}, this);
            // this.on('remove', function () {console.log('model remove');}, this);            
        }
	});
});


