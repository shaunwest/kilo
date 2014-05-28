/**
 * Created by Shaun on 5/20/14.
 */

jack2d('demo.tileLayer',
  ['demo.tileSet', 'editor.tileLayerFactory', 'promiser'],
  function(tileSetDemo, tileLayerFactory, promiser) {
    'use strict';
    var layer1, layer2;

    return {
      getTileLayers: function() {
        var promise = promiser.get();

        tileSetDemo.getTileSet().
          ready(function(tileSet, demoConfig) {
            layer1 = tileLayerFactory(tileSet, demoConfig.getLayer('1', 0).data);
            layer2 = tileLayerFactory(tileSet, demoConfig.getLayer('1', 1).data);
            promiser.resolve(promise, layer1.draw(), layer2.draw());
          });

        return promise;
      },
      updateTile: function() {
        layer1.setTile(3, 4, '2', 0);
      }
    };
  });