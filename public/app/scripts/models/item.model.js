'use strict';

define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	return Backbone.Model.extend({
		initialize: function () {
			console.log('INIT: item model');
		}
	});
});


