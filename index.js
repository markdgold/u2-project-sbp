//Requires and globals
require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
var isLoggedIn = require('./middleware/isLoggedIn');

var app = express();

//Set and Use
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});
app.use(express.static(__dirname + '/public/'));

//routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
});

app.get('/newClimb', isLoggedIn, function(req, res) {
    res.render('newClimb');
});

//controllers
app.use('/climbs', require('./controllers/climbs'));
app.use('/auth', require('./controllers/auth'));

//Listen
app.listen(3000);