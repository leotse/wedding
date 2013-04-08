/////////////////
// Main Routes //
/////////////////
var routes = {};


// home page
routes.index = function(req, res) {
	res.render('index', { 
		loggedIn: req.session.loggedIn,
		email: req.session.email
	});
};


// login page
routes.login = function(req, res) {
	res.render('login');
};

module.exports = routes;