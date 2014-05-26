
jack2d('demo.viewport', ['demo.tileSetLayer', 'editor.viewportFactory'],
function(tileSetLayer, viewportFactory) {
  'use strict';

  return {
    createViewport: function(canvas) {
      tileSetLayer.getTileLayers().ready(function(tileLayer1, tileLayer2) {
        viewportFactory.getViewport(canvas).
          addLayer(tileLayer1).
          addLayer(tileLayer2).
          checker(32).
          setPosition(16, 16).
          draw();
      });
    }
  };
});
