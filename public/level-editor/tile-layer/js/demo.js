/**
 * Created by Shaun on 5/20/14.
 */

jack2d('demo.tileLayer',
  ['demo.tileSet', 'editor.tileLayerFactory'],
  function(tileSetDemo, tileLayerFactory) {
    'use strict';
    var layer1, layer2;

    return {
      getTileLayers: function() {
        return new Promise(function(resolve, reject) {
          tileSetDemo.getTileSet().
            then(function(data) {
              layer1 = tileLayerFactory(data.tileSet, data.config.getLayer('1', 0).data);
              layer2 = tileLayerFactory(data.tileSet, data.config.getLayer('1', 1).data);
              resolve({layer1: layer1.draw(), layer2: layer2.draw()});
            });
        });
      },
      updateTile: function() {
        layer1.setTile(3, 4, '2', 0);
      }
    };
  });