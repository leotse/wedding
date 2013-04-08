////////////
// Config //
////////////
var config = {};
config.instagram = {};

// is this prod env?
var isProd = process.env.prod;

if(isProd) {
	// PROD ENV

	// cookie secret
	config.cookieSecret = "todo";

	// db
	config.db = "todo";

	// instagram api key
	config.instagram.id = "todo";
	config.instagram.secret = "todo";
	config.instagram.verifier = "todo";

} else {
	// DEV ENV

	// cookie secret
	config.cookieSecret = "44a9fac126b730f658b3449c4ad2cea9";

	// db
	config.db = "mongodb://localhost:27017/wedding";

	// instagram api key
	config.instagram.id = "9feeae5395b846c49e37e21433c6d651";
	config.instagram.secret = "a8dbd9fccdb74e8aa618a0533cbb2b6b";
	config.instagram.verifier = "a32f7625116b0d8f4e191f89abf3d0e76b7f5330";
	config.instagram.callback = "http://lwedding.dyndns.org/instagram/callback";

}


// export
module.exports = config;