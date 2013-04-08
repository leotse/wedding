///////////////////////////////
// Instagram Callback Routes //
///////////////////////////////
var instagram = {};

// libs
var _ = require('underscore')
,	config = require('../config').instagram;


// verifier callback
instagram.verify = function(req, res) {
	var query = req.query
	,	verifier = query['hub.verify_token']
	,	challenge = query['hub.challenge'];

	// make sure the verifier matches before comfirming subscription
	if(verifier === config.verifier) {
		console.log(challenge);
		res.send(challenge);
	} else {
		res.send(401);
	}
};


// subscription callbcak
instagram.callback = function(req, res) {
	var body = req.body
	,	changes = body;

	console.log('subscription callback:')
	_.each(changes, function(changed) {
		console.log(changed);
	});

	// respond to instagram api
	res.send('thanks');
};


// export
module.exports = instagram;