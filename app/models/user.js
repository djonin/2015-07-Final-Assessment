var db = require('../config.js');

var User = db.Model.extend({
	tablename: 'users',
	defaults: {
		username: 'username',
		password: 'password'
	}
});

module.exports = User;