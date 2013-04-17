/////////////////////////////////
// Subscription Picture Schema //
/////////////////////////////////

// libs
var _ = require('underscore')
,	async = require('async')
,	mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	ObjectId = Schema.ObjectId;


// schema
var schema = new Schema({

	sid: { type: ObjectId, required: true }, // subscription db id
	pid: { type: ObjectId, required: true }, // picture db id

}, { strict: true });


// statics
schema.statics.findOrCreate = function(sid, pid, callback) {
	var SubPicModel = this.model('SubscriptionPicture');

	// create the picture model if it doesn't exist
	SubPicModel.findOneAndUpdate(
		{ sid: sid, pid: pid },
		{ sid: sid, pid: pid },
		{ upsert: true, new: true },
		callback
	);	
};

schema.statics.findBySid = function(sid, callback) {
	var SubscriptionPicture = mongoose.model('SubscriptionPicture')
	,	Picture = mongoose.model('Picture'); 

	async.waterfall([

		// get the picture ids
		function(done) { 
			SubscriptionPicture
			.find()
			.where('sid', sid)
			.exec(done);
		},

		// then the actual pictures!
		function(subscriptionPics, done) {
			var pids = _.pluck(subscriptionPics, 'pid');
			Picture.findByIds(pids, done);
		}

	], callback);
};


// export
module.exports = mongoose.model('SubscriptionPicture', schema);