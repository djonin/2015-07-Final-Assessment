var AppDispatcher = require('./dispatcher.js');
var request = require('request');
module.exports = {

	searchForGifs: function(evt) {
		var input = evt.target.value;
		var replaced = input.split(' ').join('+');
		request({
	      url: 'http://api.giphy.com/v1/gifs/search?q='+replaced+'&api_key=dc6zaTOxFJmzC',
		    method: 'GET',
	      contentType: 'application/json'
			}, 
			function(error, response, data) {
	        var parsed = JSON.parse(data).data;    
	        AppDispatcher.dispatch({actionType: 'updateResults', data: parsed});
    	});
	}

}