/**
 * User: shaun
 * Date: 1/4/14 10:25 PM
 */

//Load Modules
var express = require('express');
var engine = require('ejs-locals'); // this is no longer maintained?
var http = require('http');
var path = require('path');
var routes = require('./routes');
var users = require('./routes/users');

var app = express();

// Configuration
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// Set Dev Mode
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.devMode = true;
} else {
    app.locals.devMode = false;
}

// App Vars
app.locals.appTitle = 'Retro 2D';

// Routes
app.get('/', routes.index);
app.get('/users', users.all);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});