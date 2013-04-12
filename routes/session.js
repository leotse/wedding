////////////////////
// Session Routes //
////////////////////
var routes = {};


// libs
var models = require('../models')
,	User = models.User
,	net = require('../helpers/net')
,	auth = require('../helpers/auth');


// login action
routes.login = function(req, res) {
	var body = req.body
	,	email = body.email
	,	password = body.password;
	
	User.login(email, password, function(err, user) {

		// set session if login successful
		if(user) {
			auth.login(req, user);
			res.redirect('/subscriptions');
		} else {
			res.redirect('/login');
		}
	});
};


// logout action
routes.logout = function(req, res) {
	auth.logout(req);
	res.redirect('/');
}


// export
module.exports = routes;