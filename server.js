var path = require('path');
var express = require('express');
var app = express();
var session = require('express-session');
var router = require('./routes/router.js');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
app.use(cookieParser('placeholder_secret'));
app.use(session({secret: 'placeholder_secret', cookie: {maxAge: 600000}}));
app.use(passport.initialize());
// Parse json
app.use(bodyParser.json());
// Parse forms

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/bundle", express.static(__dirname + '/client/bundle'));
app.use('/', router);
app.listen(process.env.PORT || 3000);
