//////////////////
// Auth Helpers //
//////////////////
var auth = {};


// checks if the current user is logged in
auth.authorize = function(req, res, next) {
	var loggedIn = req.session && req.session.loggedIn;

	if(loggedIn) next();
	else res.redirect('/login');
};


// logs in the session as the given user
auth.login = function(req, user) {
	req.session.loggedIn = true;
	req.session.user = user;
};


auth.logout = function(req) {
	if(req.session) req.session.destroy();
};


// gets the logged in user
auth.user = function(req) {
	var session = req.session;
	if(session) return session.user;
	return null;
};


// export
module.exports = auth;