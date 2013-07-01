'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'feedModel'
], function ($, _, Backbone, FeedModel) {
	return Backbone.Collection.extend({
		model: FeedModel,
		url: function () {
			return '/api/v1/feeds';
		},
		
		initialize: function (options) {
            this.globalEvents = options.globalEvents;
			console.log('INIT: feedlist collection');
            this.bindEvents();
            this.fetch();
		},

		fetch: function () {
			var self = this;
			$.ajax({
				url: '/api/v1/feeds',
				success: function (response) {
					console.log('response', response);
					if (response.success) {
						self.set(response.entity);
					}
				}
			});
		},

        bindEvents: function () {
            var self = this;
            this.on('add', function () {console.log('model add');}, this);
            this.on('remove', function () {console.log('model remove');}, this);
            this.globalEvents.on('global:refresh', this.fetch, this);           
        }
	});
});


