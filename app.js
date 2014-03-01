/**
 * User: shaun
 * Date: 1/4/14 10:25 PM
 */

//Load Modules
var express     = require('express'),
    partials    = require('express-partials'),
    http        = require('http'),
    path        = require('path'),
    routes      = require('./routes'),
    assets      = require('./routes/assets'),
    config      = require('./routes/config'),
    app         = express(),
    zero        = 0,
    oneDay      = 86400000;

// Configuration
app.use(partials());

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: zero }));
app.use(app.router);
//app.use(routes.index); // Using explicit routes only

// Set Dev Mode
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.devMode = true;
} else {
    app.locals.devMode = false;
}

// APP VARS
app.locals.appTitle = 'Retro 2D';


// ROUTES
app.get('/:appId/sources/:groupName', assets.listAssets);
app.get('/:appId/sources/:groupName/:sourceName', assets.getAsset);

app.get('/:appId/config', config.getConfig);
app.post('/:appId/config', config.putConfig);

app.get('/login', routes.index);
app.get('/', routes.index);


module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
