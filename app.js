
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  ,	instagram = require('./routes/instagram')
  ,	session = require('./routes/session')
  , subscriptions = require('./routes/subscriptions')
  , http = require('http')
  , path = require('path')
  ,	config = require('./config')
  ,	MongoStore = require('connect-mongo')(express)
  , auth = require('./helpers/auth');


// create express instance
var app = express();


// conditional session - turned off for instagram callack
var sessionware = express.session({ 
  secret: config.cookieSecret,
  store: new MongoStore({ url: config.db, maxAge: 3600000 })
});
var conditionalSession = function(req, res, next) {
  var enabled = req.url.indexOf('/instagram') < 0;
  if(enabled) sessionware(req, res, next);
  else next();
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(conditionalSession);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// auth required routes
app.all('/subscriptions*', auth.authorize);

// site routes
app.get('/', routes.index);
app.post('/subscriptions/:id/update', subscriptions.update);
app.post('/subscriptions/:id/delete', subscriptions.del);
app.post('/subscriptions/:id/activate', subscriptions.activate);
app.post('/subscriptions/:id/deactivate', subscriptions.deactivate);
app.get('/subscriptions/:id', subscriptions.get);
app.post('/subscriptions', subscriptions.add);
app.get('/subscriptions', subscriptions.index);

// login routes
app.get('/login', routes.login);
app.post('/login', session.login);
app.get('/logout', session.logout);

// instagram routes
app.get('/instagram/callback', instagram.verify);
app.post('/instagram/callback', instagram.callback);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// test instagram subscription... not working though for some reason
var api = require('./api/instagram');
// api.listSubscriptions(function(err, res) {
// 	if(err) throw err;
// 	console.log(res);
// });
// api.subscribe('hello', function(err, res) {
// 	if(err) throw err;
// 	console.log(res);
// });
// api.unsubscribe(function(err, res) {
// 	if(err) throw err;
// 	console.log(res);
// });