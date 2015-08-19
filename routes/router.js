var express = require('express');
var request = require('request');
var router = express.Router();
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var salt = '$2a$10$tIhQWTfpMC3Hkh7NjrgbRe';
var client_dir = './client/';
var db = require('../app/config');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var currentRequest;


passport.use(new GitHubStrategy({
    clientID: '6115e40e41cd84e85867',
    clientSecret: '3b9b98f5c2acd08a16e127d58df863587e5d3403',
    callbackURL: "http://gifstore.com:3000/verify"
  },
  function(accessToken, refreshToken, profile, done) {
  	if(profile.username) {
  		console.log('asdasdasdasdasd!');
  		var id = profile.username;
  		db.knex('users')
  			.where({
  				'githubid' : id
  			})
  			.select('username')
  		.then(function(entries) {
    		if(entries[0]) {
    			console.log('logged in as ', profile)
  				return done(undefined, entries[0].username);
	    	} else {
  				return done({ status: 404}, null);
	    	}
  		});
  	} else {
  		return done({ status: 404}, null);
  	}
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


router.get('/', function(req, res) {
	console.log(req.session.passport.user);
	if (req.session.passport.user) {
    res.sendfile(client_dir + 'index.html');
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/signin');
  }
});

router.get('/github', passport.authenticate('github'));

router.get('/verify', passport.authenticate('github'),
  function(req, res) {
  	console.log('SESSION: ', req.session);
    res.redirect('/');
 	});

router.get('/')

router.get('/signin', function(req, res) {
   res.sendfile(client_dir + 'signin.html');
});

router.post('/signin', function(req,res) {
	var credentials = req.body;
  bcrypt.hashAsync(credentials.password, salt, null)
  .then(function(hash) {
    return db.knex('users')
	    .where({
	      'username' : credentials.username,
	      'password' : hash
	    })
	    .select('username');
  })
  .then(function(entries) {
    if(entries[0]) {
      req.session.regenerate(function() {
        req.session.user = entries[0].username;
        res.redirect('/');
      });
    } else {
      res.redirect('/signin');
    }
  })
  .catch(function(err) {
  	console.log('sigin in error: ',err);
    res.redirect('/signin');
  });
});

router.get('/signup', function(req, res) {
   res.sendfile(client_dir + 'signup.html');
});

router.post('/signup', function(req,res) {
	var credentials = req.body;
  bcrypt.hashAsync(credentials.password, salt, null)
  .then(function(hash) {
    return db.knex('users')
      .insert({
        'username' : credentials.username,
        'githubid' : credentials.adskid,
        'password' : hash
      });
  })
  .then(function(result){
    return req.session.regenerate(function() {
      req.session.user = credentials.username;
      res.redirect('/');
    })
  })
  .catch(function(err) {
  	console.log('sign up error: ',err);
    res.redirect('/signup');
  });
});

router.get('*', function(req, res) {
	res.redirect('/');
});

module.exports = router;