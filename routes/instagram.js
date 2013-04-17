///////////////////////////////
// Instagram Callback Routes //
///////////////////////////////
var instagram = {}

// libs
var _ = require('underscore')
,	auth = require('../helpers/auth')
,	config = require('../config').instagram
,	models = require('../models')
,	Job = models.Job;


// verifier callback
instagram.verify = function(req, res) {
	var query = req.query
	,	verifier = query['hub.verify_token']
	,	challenge = query['hub.challenge'];

	// make sure the verifier matches before comfirming subscription
	if(verifier === config.verifier) {
		res.send(challenge);
	} else {
		res.send(401);
	}
};


// subscription callbcak
instagram.callback = function(req, res) {
	// respond to instagram api asap!
	res.send('done');

	// don't keep session for instagram callback
	auth.logout(req);

	var body = req.body
	,	changes = body;
	_.each(changes, function(changed) {
		Job.create(changed);
	});
};


// export
module.exports = instagram;