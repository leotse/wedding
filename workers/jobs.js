/////////////////
// Jobs Worker //
/////////////////
var worker = {};


// libs
var _ = require('underscore')
,	async = require('async')
,	models = require('../models')
,	Job = models.Job
,	Picture = models.Picture
,	instagram = require('../api/instagram');


// constants
var WORKERS = 1
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

		async.waterfall([

			// get the images from instagram
			function(done) { instagram.tagRecent(tag, done); },

			// then process and store the pictures
			function(media, done) {
				async.each(media, Picture.create, done);
			}
			
		], function(err) {
			if(err) job.error(err.message);
			else job.complete();
		});
	}
}