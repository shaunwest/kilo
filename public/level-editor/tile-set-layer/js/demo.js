/**
 * Created by Shaun on 5/20/14.
 */

jack2d('demo.tileSetLayer',
  ['http', 'promiser', 'editor.tileSetFactory', 'editor.tileLayerFactory', 'helper', 'config'],
  function(http, promiser, tileSetFactory, tileLayerFactory, helper, config) {
    'use strict';
    config.tileWidth = config.tileHeight = 16;

    return {
      getTileLayer: function() {
        var promise = promiser.get();

        http.get('../../data/demo-config.json').
          error(function(statusText, status) {
            helper.log('Error: ' + status + ': ' + statusText);
          }).
          ready(function(demoConfig) {
            tileSetFactory.get(demoConfig.tileSets[0].sources).ready(function(tileSet) {
              promiser.resolve(promise, tileLayerFactory.get(tileSet, demoConfig.levels[0].layers[0].data));
            });
          });

        return promise;
      }
    };
  });