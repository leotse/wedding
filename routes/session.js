////////////////////
// Session Routes //
////////////////////
var routes = {};


// libs
var models = require('../models')
,	User = models.User
,	net = require('../helpers/net');


// login action
routes.login = function(req, res) {
	var body = req.body
	,	email = body.email
	,	password = body.password;
	
	User.login(email, password, function(err, success) {

		// set session if login successful
		if(success) {
			req.session.loggedIn = true;
			req.session.email = email;
			res.redirect('/');
			return;
		}

		// and respond to user
		net.send(err, success, res);
	});
};


// logout action
routes.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
}


// export
module.exports = routes;