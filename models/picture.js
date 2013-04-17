//////////////////////
// Instagram Schema //
//////////////////////
// this model is to store an instagram image
// 

// libs
var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	ObjectId = Schema.ObjectId;


// schema
var schema = new Schema({

	pid: { type: String, unique: true },
	images: {
		s: { type: String, required: true },
		m: { type: String, required: true },
		l: { type: String, required: true }
	},
	doc: {}

}, { strict: true });


// statics
schema.statics.findOrCreate = function(doc, callback) {
	var PictureModel = mongoose.model('Picture')
	,	pid = doc.id;

	// create the picture model if it doesn't exist
	PictureModel.findOneAndUpdate(
		{ pid: pid },
		getUpdates(doc),
		{ upsert: true, new: true },
		callback
	);	
};

schema.statics.findByIds = function(ids, callback) {
	var Picture  = mongoose.model('Picture');
	Picture
	.find()
	.in('_id', ids)
	.exec(callback);
};


// export
module.exports = mongoose.model('Picture', schema);


/////////////
// Helpers //
/////////////

function getUpdates(doc) {
	var updates = {};
	updates.pid = doc.id;
	updates.images = {
		s: doc.images.thumbnail.url,
		m: doc.images.low_resolution.url,
		l: doc.images.standard_resolution.url
	};
	updates.doc = doc;
	return updates;
}