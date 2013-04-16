/////////////////////////////////
// Subscription Picture Schema //
/////////////////////////////////

// libs
var mongoose = require('mongoose')
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


// export
module.exports = mongoose.model('SubscriptionPicture', schema);