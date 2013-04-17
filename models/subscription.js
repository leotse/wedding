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
	var SubscriptionModel = mongoose.model('Subscription');
	var subscrpition = new SubscriptionModel();
	subscrpition.sid = sid;
	subscrpition.uid = uid;
	subscrpition.tag = tag;
	subscrpition.name = name;
	subscrpition.description = desc;
	subscrpition.save(callback);
};

schema.statics.findByUid = function(uid, callback) {
	var Subscription = mongoose.model('Subscription');
	Subscription.find()
		.where('uid', uid)
		.exec(callback);
};

schema.statics.findBySid = function(sid, callback) {
	var Subscription = mongoose.model('Subscription');
	Subscription.find()
		.where('sid', sid)
		.where('state', 'active')
		.sort('-lastUpdated')
		.exec(callback);
};


// methods
schema.methods.activate = function(callback) {
	this.state = 'active';
	this.save(callback);
}

schema.methods.deactivate = function(callback) {
	this.state = 'inactive';
	this.save(callback);
}


// export
module.exports = mongoose.model('Subscription', schema);