/////////////////
// User Schema //
/////////////////

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	ObjectId = Schema.ObjectId;


// enums
var states = 'inactive active'.split(' ');


// schema
var schema = new Schema({

	uid: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	tag: { type: String, required: true },
	state: { type: String, enum: states, default: 'inactive' }

});


// statics
schema.statics.create = function(uid, tag, name, desc, callback) {
	var SubscriptionModel = this.model('Subscription');
	var subscrpition = new SubscriptionModel();
	subscrpition.uid = uid;
	subscrpition.tag = tag;
	subscrpition.name = name;
	subscrpition.description = desc;
	subscrpition.save(callback);
};

schema.statics.findByUid = function(uid, callback) {
	var Subscription = this.model('Subscription');
	Subscription.find()
		.where('uid', uid)
		.exec(callback);
};


// export
module.exports = mongoose.model('Subscription', schema);