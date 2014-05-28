
jack2d('demo.viewport', ['demo.tileLayer', 'editor.viewportFactory'],
function(tileLayerDemo, viewportFactory) {
  'use strict';

  var viewport;

  return {
    createViewport: function(canvas) {
      tileLayerDemo.getTileLayers().ready(function(tileLayer1, tileLayer2) {
        viewport = viewportFactory(canvas).
          addLayer(tileLayer1).
          addLayer(tileLayer2).
          checker(16).
          draw();
      });
    },
    toggleLayer1: function() {
      viewport.clear();
      (viewport.getLayer(0).visible) ?
        viewport.hideLayer(0).draw() :
        viewport.showLayer(0).draw();
    },
    toggleLayer2: function() {
      viewport.clear();
      (viewport.getLayer(1).visible) ?
        viewport.hideLayer(1).draw() :
        viewport.showLayer(1).draw();
    },
    slideRight: function() {
      viewport.setPosition(viewport.getPosition().x += 8, viewport.getPosition().y);
    },
    slideDown: function() {
      viewport.setPosition(viewport.getPosition().x, viewport.getPosition().y += 8);
    },
    resetPosition: function() {
      viewport.setPosition(0, 0);
    }
  };
});
