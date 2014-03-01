/**
 * Created by shaun on 2/28/14.
 */

var fs = require('fs');

function getConfig(req, res) {
  var appId = req.params.appId;

  res.sendfile('data/' + appId + '/config.json', function(err) {
    if(err) {
      res.status(404);
      res.render('404.ejs');
    }
  });
}

function putConfig(req, res) {
  var appId = req.params.appId,
      appPath = (appId) ? 'data/' + appId : '';

  if(!req.is('application/json')) {
    res.status(406);
    res.send({
      'message': 'Only application/json is accepted',
      'acceptedContentTypes': ['application/json']
    });

  } else if (appPath === '') {
    res.status(400);
    res.send({'message': 'App Id was not provided'});

  } else {
    fs.exists(appPath, function(exists) {
      var fileData = '';

      if(!exists) {
        res.status(404);
        res.send({'message': 'App Id was not found'});

      } else {
        fileData = JSON.stringify(req.body, null, 2);

        fs.writeFile(appPath + '/test.json', fileData, function(err) {
          if(err) {
            console.log('Config: Could not save config file for app "' + appId + '": ' + err);

            res.status(500);
            res.send({'message': 'There was an error saving config'});

          } else {
            res.status(200);
            res.send({'message': 'Config saved'});
          }
        });
      }
    });
  }
}

module.exports = {
  'getConfig': getConfig,
  'putConfig': putConfig
};

