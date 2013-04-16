/////////////////
// Jobs Worker //
/////////////////
var worker = {};


// libs
var _ = require('underscore')
,	async = require('async')
,	models = require('../models')
,	Job = models.Job
,	Subscription = models.Subscription
,	Picture = models.Picture
,	SubscriptionPicture = models.SubscriptionPicture
,	instagram = require('../api/instagram');


// constants
var WORKERS = 10
,	INITIAL_TIMEOUT = 1000
,	JOB_TIMEOUT = 1000;


// start the worker!
setTimeout(start, INITIAL_TIMEOUT);


// worker entry point
function start() {
	console.log('starting instagram callback worker');
	_.times(WORKERS, retreiveJob);
}


function retreiveJob() {
	// console.log('retrieving job');
	Job.findOneAndUpdate(
		{ state: "pending" },
		{ state: "processing" },
		{ new: false, upsert: false },
		processJob
	);
}


function processJob(err, job) {
	// console.log('processing job');
	if(err) throw err;
	else if(!job) setTimeout(retreiveJob, JOB_TIMEOUT);
	else {
		var payload = job.payload
		,	sid = payload.subscription_id
		,	time = payload.time
		,	tag = payload.object_id;

		async.auto({

			// get recent from instagram
			instagram: function(done) { instagram.tagRecent(tag, done); },

			// get the subscription related to this subscription
			subscriptions: function(done) { Subscription.findBySid(sid, done); },

			// push the instagram pictures to the subscriptions
			process: [ 'instagram', 'subscriptions', function(done, results) {
				var pictures = results.instagram.data
				,	subscriptions = results.subscriptions;

				var picDate, subscriptionDate;
				_.each(pictures, function(picture) {
					picDate = new Date(picture.created_time * 1000);
					_.each(subscriptions, function(subscription) {
						subscriptionDate = subscription.lastUpdated;

						// if the subscript was last updated before the picture was tagged
						// then push the picture to this subscription
						async.waterfall([

							// create find or create the picture
							function(done) { Picture.findOrCreate(picture, done); },

							// then push the picture to the associated subscription
							function(picture, done) { 
								SubscriptionPicture.findOrCreate(subscription._id, picture._id, done); 
							}

						], function(err) { if(err) console.error(err); });
					});
				});
				done();
			}]

		}, function(err, results) {
			if(err) job.error(err.message);
			else job.complete();
			process.nextTick(retreiveJob);
		});
	}
}