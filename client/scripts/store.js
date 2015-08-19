var AppDispatcher = require('./dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var searchResults = [];

var updateResults = function(data) {
	searchResults = [];
	for (var key in data) {
		var gif = data[key];
		if(gif.embed_url) {
			searchResults.push({url: gif.embed_url});
		}
	}
}

var Store = assign({}, EventEmitter.prototype, {
	getResults: function() {
		return searchResults;
	},

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}

});

AppDispatcher.register(function(action) {
	switch (action.actionType) {
		case 'updateResults':
			updateResults(action.data);
			Store.emitChange();
			break;
	}
});

module.exports = Store;