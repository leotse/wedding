///////////////////
// Models Module //
///////////////////
var models = {};


// libs
var mongoose = require('mongoose')
,	config = require('../config').db;


// connect to db
mongoose.connect(config, function(err) {
	if(err) throw err;
	else console.log('connected to db: ' + config);
});


// models
models.User = require('./user');
models.Subscription = require('./subscription');


// export
module.exports = models;