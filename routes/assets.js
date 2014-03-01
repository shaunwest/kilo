/**
 * Created by shaun on 1/28/14.
 */

var fs = require('fs');

var assets = {
  getAsset: function(req, res) {
    var appId     = req.params.appId,
      groupName   = req.params.groupName,
      filename  = req.params.sourceName;

    res.sendfile('data/' + appId + '/sources/' + groupName + '/' + filename, function(err){
      if(err) {
        res.status(404);
        res.render('404.ejs');
      }
    });
  },

  listAssets: function(req, res) {
    var appId     = req.params.appId,
      groupName   = req.params.groupName,
      data    = [];

    fs.readdir('data/' + appId + '/sources/' + groupName, function(err, files) {
      if(err) {
        res.status(404);
        res.render('404.ejs');
      } else {
        for(var i = 0; i < files.length; i++) {
          data.push({filename: files[i]});
        }
        res.send(data);
      }
    });
  }
};

module.exports = assets;

