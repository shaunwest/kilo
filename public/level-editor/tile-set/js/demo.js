/**
 * Created by Shaun on 5/27/14.
 */

jack2d('demo.tileSet',
['appConfig', 'helper', 'http', 'editor.tileSetFactory', 'configDecorator'],
function(appConfig, helper, http, tileSetFactory, configDecorator) {
  'use strict';

  return {
    getTileSet: function() {
      appConfig.tileWidth = appConfig.tileHeight = 16;

      return new Promise(function(resolve, reject) {
        http.get('../../data/demo-config.json').then(
          function(response) {
            var demoConfig = configDecorator(response.data);
            tileSetFactory(demoConfig.getSources('1')).then(function(tileSet) {
              resolve({tileSet: tileSet, config: demoConfig});
            });
          },
          function(response) {
            helper.log('Error: ' + response.status + ': ' + response.statusText);
          });
      });
    }
  };
});