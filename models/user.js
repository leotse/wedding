/////////////////
// User Schema //
/////////////////

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	h = require('../helpers/crypto');


var schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true },
	joined: { type: Date, default: Date.now },

	// password stuff
	hash: { type: String, required: true, select: false },
	salt: { type: String, required: true, select: false }
}, { strict: true });


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
	.select('name email joined salt hash')
	.exec(function(err, user) {
		if(err) callback(err);
		else if(!user) callback(new Error('user not found'));
		else {

			var salt = user.salt
			,	hash = user.hash;

			// calculate and compare hash
			var calcHash = h.hash(password, salt);
			if(calcHash === hash) {
				var sessionuser = {
					_id: user._id,
					name: user.name,
					email: user.email
				}
				callback(null, sessionuser);
			} else {
				callback(null, null);
			}
		}
	});
};

// export
module.exports = mongoose.model('User', schema);