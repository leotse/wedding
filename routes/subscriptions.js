//////////////////////////
// Subscriptions Routes //
//////////////////////////
var routes = {};


// libs
var async = require('async')
,	net = require('../helpers/net')
,	models = require('../models')
,	Subscription = models.Subscription;


// list user subscriptions
routes.index = function(req, res) {
	var user = req.session.user
	,	uid = user._id;

	// find user subscriptions
	Subscription.findByUid(uid, function(err, subs) {
		if(err) net.send(err, null, res);
		else res.render('subscriptions', { subscriptions: subs });
	});
};


// get details about a subscription
routes.get = function(req, res) {
	var params = req.params
	,	id = params.id;
	Subscription.findById(id, function(err, sub) {
		if(err) net.send(err, null, res);
		else res.render('subscription', { subscription: sub });
	});
};


// add subscription
routes.add = function(req, res) {
	var session = req.session
	,	uid = session.user._id
	,	body = req.body
	,	tag = body.tag
	,	name = body.name
	,	desc = body.desc;
	
	Subscription.create(uid, tag, name, desc, function(err, created) {
		if(err) net.send(err, null, res);
		else res.redirect('/subscriptions');
	});
};


// update an subscription
routes.update = function(req, res) {
	var params = req.params
	,	id = params.id
	,	body = req.body
	,	tag = body.tag
	,	name = body.name
	,	desc = body.desc;

	async.waterfall([

		// find the subscription
		function(done) { Subscription.findById(id, done); },

		// then update the fields
		function(sub, done) {
			if(!sub) net.send(new Error('subscription not found', null, res));
			else {
				sub.tag = tag;
				sub.name = name;
				sub.description = desc;
				sub.save(done);
			}
		}

	], function(err, updated) {
		if(err) net.send(err, null, res);
		else res.redirect('/subscriptions');
	});
};


// removes a subscription
routes.del = function(req, res) {
	var params = req.params
	,	id = params.id;

	console.log('deleteing ' + id);
	async.waterfall([

		// find the subscription
		function(done) { Subscription.findById(id, done); },

		// then remove from db
		function(sub, done) {
			if(!sub) net.send(new Error('subscription not found', null, res));
			else sub.remove(done);
		}

	], function(err, deleted) {
		if(err) net.send(err, null, res);
		else res.redirect('/subscriptions');
	});
};


module.exports = routes;