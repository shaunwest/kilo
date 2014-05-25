/**
 * Created by Shaun on 5/20/14.
 */

jack2d('demo.tileSetLayer',
  ['http', 'promiser', 'editor.tileSetFactory', 'editor.tileLayerFactory', 'helper', 'config'],
  function(http, promiser, tileSetFactory, tileLayerFactory, helper, config) {
    'use strict';
    config.tileWidth = config.tileHeight = 16;

    return {
      getTileLayers: function() {
        var promise = promiser.get();

        http.get('../../data/demo-config.json').
          error(function(statusText, status) {
            helper.log('Error: ' + status + ': ' + statusText);
          }).
          ready(function(demoConfig) {
            tileSetFactory.getTileSet(demoConfig.tileSets[0].sources).ready(function(tileSet) {
              var layer1 = tileLayerFactory.getTileLayer(tileSet, demoConfig.levels[0].layers[0].data),
                layer2 = tileLayerFactory.getTileLayer(tileSet, demoConfig.levels[0].layers[1].data);

              promiser.resolve(promise, layer1.draw(), layer2.draw());
            });
          });

        return promise;
      }
    };
  });