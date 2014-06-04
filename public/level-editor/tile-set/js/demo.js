/**
 * Created by Shaun on 5/27/14.
 */

jack2d('demo.tileSet',
['appConfig', 'helper', 'http', 'promiser', 'editor.tileSetFactory', 'configDecorator'],
function(appConfig, helper, http, promiser, tileSetFactory, configDecorator) {
  'use strict';

  return {
    getTileSet: function() {
      appConfig.tileWidth = appConfig.tileHeight = 16;

      var promise = promiser.get();

      http.get('../../data/demo-config.json').then(
        function(response) {
          var demoConfig = configDecorator(response.data);
          tileSetFactory(demoConfig.getSources('1')).ready(function(tileSet) {
            promiser.resolve(promise, tileSet, demoConfig);
          });
        },
        function(response) {
          helper.log('Error: ' + response.status + ': ' + response.statusText);
        });
      return promise;
    }
  };
});