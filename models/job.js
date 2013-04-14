////////////////
// Job Schema //
////////////////

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	ObjectId = Schema.ObjectId;


// enums
var states = 'pending processing complete error'.split(' ');


// schema
var schema = new Schema({

	state: { type: String, enum: states, default: 'pending' },
	payload: { type: {}, required: true },
	message: { type: String }

}, { strict: true });


// indexes
schema.index({ state: 1 });


// statics
schema.statics.create = function(payload, callback) {
	var JobModel = mongoose.model('Job');
	var job = new JobModel;
	job.payload = payload;
	job.save(callback);
};


// methods
schema.methods.error = function(msg) {
	this.state = 'error';
	this.message = msg;
	this.save();
};

schema.methods.complete = function() {
	this.state = 'complete';
	this.save();
}


// export
module.exports = mongoose.model('Job', schema);