/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-awesome-datatable',
	isDevelopingAddon: function() {
		return true;
	},
	included: function(app) {
		this._super.included.apply(this, arguments);
		app.import(app.bowerDirectory + '/moment/min/moment.min.js');
	}
};
