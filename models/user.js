/////////////////
// User Schema //
/////////////////

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	h = require('../helpers/password');


var schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true },
	joined: { type: Date, default: Date.now },

	// password stuff
	hash: { type: String, required: true, select: false },
	salt: { type: String, required: true, select: false }
});

// statics
schema.statics.create = function(name, email, password, callback) {
	var UserModel = this.model('User')
	,	user = new UserModel();

	// basic fields
	user.name = name;
	user.email = email;
	user.joined = Date.now();

	// password hash
	var salt = h.rand()
	,	hash = h.hash(password, salt); 
	user.salt = salt;
	user.hash = hash;

	// save password
	user.save(callback);
};

schema.statics.login = function(email, password, callback) {
	var UserModel = this.model('User');

	// find the user
	UserModel.findOne()
	.where('email', email)
	.select('salt hash')
	.exec(function(err, user) {
		if(err) callback(err);
		else if(!user) callback(new Error('user not found'));
		else {

			var salt = user.salt
			,	hash = user.hash;

			// calculate and compare hash
			var calcHash = h.hash(password, salt);
			if(calcHash === hash) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		}
	});
};


// export
module.exports = mongoose.model('User', schema);