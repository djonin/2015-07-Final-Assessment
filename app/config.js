var Bookshelf = require('bookshelf');
var path = require('path');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'dmitry',
    password: 'bootcamp15',
    database: 'gifstoredb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/gifstore.sqlite')
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 255);
      user.string('githubid', 255);
      user.string('password', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;