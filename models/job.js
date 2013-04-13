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

	state: { type: String, enum: states, default: 'active' }

});

// export
module.exports = mongoose.model('Job', schema);