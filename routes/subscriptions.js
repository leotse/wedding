//////////////////////////
// Subscriptions Routes //
//////////////////////////
var routes = {};


// libs
var async = require('async')
,	net = require('../helpers/net')
,	models = require('../models')
,	Subscription = models.Subscription
,	instagram = require('../api/instagram');


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
	
	async.waterfall([

		// subscribe to instagram
		function(done) { instagram.subscribe(tag, done); },

		// and create subscription in db
		function(data, done) {
			var sid = data.id;
			Subscription.create(sid, uid, tag, name, desc, done); 
		}

	], function(err, result) {
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

	var dbsub = null;
	async.waterfall([

		// find the subscription
		function(done) { Subscription.findById(id, done); },

		// subscribe to instagram if tag changed
		function(subscription, done) {
			dbsub = subscription;

			// error out if subscription is not found
			if(!dbsub) callback(new Error('subscription not found'));
			else {
				// tag changed! update instagram subscription
				instagram.subscribe(tag, done);
			}
		},

		// then update the fields
		function(res, done) {
			dbsub.tag = tag;
			dbsub.name = name;
			dbsub.description = desc;
			dbsub.lastUpdated = Date.now();
			dbsub.save(done);
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