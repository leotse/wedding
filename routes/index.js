/////////////////
// Main Routes //
/////////////////
var routes = {};


// libs
var models = require('../models')
,	User = models.User;


// home page
routes.index = function(req, res) {
	res.render('index');
};


// login page
routes.loginPage = function(req, res) {
	res.render('login');
};


// login action
routes.login = function(req, res) {
	var body = req.body
	,	email = body.email
	,	password = body.password;
	
	User.login(email, password, function(err, success) {
		if(err) res.send(err);
		else res.send(success);
	});
};

module.exports = routes;