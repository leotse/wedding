
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  ,	instagram = require('./routes/instagram')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/login', routes.loginPage);
app.post('/login', routes.login);

// instagram routes
app.get('/instagram/callback', instagram.verify);
app.post('/instagram/callback', instagram.callback);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// test instagram subscription... not working though for some reason
// var api = require('./api/instagram');
// api.listSubscriptions(function(err, res) {
// 	if(err) console.log(err.message);
// 	else console.log(res);
// });
// api.subscribe('nofilter', function(err, res) {
// 	if(err) console.log(err.message);
// 	else console.log(res);
// });
// api.unsubscribe(function(err, res) {
// 	if(err) console.log(err.message);
// 	else console.log(res);
// });