//////////////////////
// Password Helpers //
//////////////////////
var password = {};


// libs
var crypto = require('crypto');


// generate random number
password.rand = function() {
	var whirlpool = crypto.createHash('whirlpool');
	return crypto.randomBytes(256).toString('hex');
};


// hash password + salt
password.hash = function(password, salt) {
	var whirlpool = crypto.createHash('whirlpool')
	,	ps = salt + '-' + password
	,	hash = whirlpool.update(ps).digest('hex')
	return hash;
};


// export
module.exports = password;