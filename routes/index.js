/////////////////
// Main Routes //
/////////////////
var routes = {};


// libs
var net = require('../helpers/net')
,	auth = require('../helpers/auth')
,	models = require('../models')
,	Subscription = models.Subscription;


// home page
routes.index = function(req, res) {
	var user = auth.user(req);
	res.render('index', { 
		loggedIn: req.session.loggedIn,
		name: user ? user.name : null
	});
};


// login page
routes.login = function(req, res) {
	res.render('login');
};

module.exports = routes;