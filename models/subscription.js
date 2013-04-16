/////////////////////////
// Subscription Schema //
/////////////////////////

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	ObjectId = Schema.ObjectId;


// enums
var states = 'inactive active'.split(' ');


// schema
var schema = new Schema({

	sid: { type: Number, required: true }, // subscription id
	uid: { type: ObjectId, required: true }, // user id
	tag: { type: String, required: true },
	name: { type: String, required: true }, 
	description: { type: String, required: true },
	state: { type: String, enum: states, default: 'active' },
	lastUpdated: { type: Date, default: Date.now }

}, { strict: true });


// define indexes
schema.index({ sid: 1 });
schema.index({ uid: 1 });


// statics
schema.statics.create = function(sid, uid, tag, name, desc, callback) {
	var SubscriptionModel = this.model('Subscription');
	var subscrpition = new SubscriptionModel();
	subscrpition.sid = sid;
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

schema.statics.findBySid = function(sid, callback) {
	var Subscription = this.model('Subscription');
	Subscription.find()
		.where('sid', sid)
		.sort('-lastUpdated')
		.exec(callback);
};


// export
module.exports = mongoose.model('Subscription', schema);