///////////////////////////
// Instagram API Wrapper //
///////////////////////////
var instagram = {};


// libs
var util = require('util')
,	request = require('request')
,	config = require('../config').instagram;


// constants
var BASE_URL = "https://api.instagram.com/v1"
,	SUBSCRIBE = "/subscriptions"


// list subscriptions
instagram.listSubscriptions = function(callback) {
	var url = signRequest(BASE_URL + SUBSCRIBE);
	requestAndParse(url, callback);
};


// create subscription
instagram.subscribe = function(tag, callback) {
	var url = signRequest(BASE_URL + SUBSCRIBE)
	,	data = {
			object: 'tag',
			object_id: tag,
			aspect: 'media',
			verify_token: config.verifier,
			callback_url: config.callback
		};
	
	// make the request to instagram api!
	var params = {
			method: 'post',
			url: url,
			form: data
		};
	requestAndParse(params, callback);
};


// remove all subscription
instagram.unsubscribe = function(callback) {
	var url = signRequest(BASE_URL + SUBSCRIBE + "?object=all")
	,	params = {
			method: 'delete',
			url: url
		}
	requestAndParse(params, callback);
};


// export
module.exports = instagram;


/////////////
// Helpers //
/////////////

function signRequest(url) {
	var index = url.indexOf('?');

	// append the request api key and secret
	url += (index < 0) ? '?' : '&';
	url += 'client_id=' + config.id;
	url += '&client_secret=' + config.secret;

	return url;
}

function requestAndParse(params, callback) {
	request(params, function(err, res, body) {
		if(err) callback(err);
		else if(res.statusCode !== 200) callback(new Error(res.statusCode + ': ' + body));
		else {
			try {
				var json = JSON.parse(body);

				// verify status from instagram api
				if(json.meta.code === 200) callback(null, json.data);
				else {
					var error = new Error(json.meta.code + ': ' + json.meta.error_type + ': ' + json.meta.error_message);
					callback(error);
				}
			} catch(ex) {
				callback(new Error('json parsing error: ' + ex.message));
			}
		}
	});
}