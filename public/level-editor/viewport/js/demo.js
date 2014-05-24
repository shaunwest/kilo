
jack2d('demo.viewport', ['demo.tileSetLayer', 'editor.viewportFactory'],
function(tileSetLayer, viewportFactory) {
  'use strict';

  return {
    createViewport: function(canvas) {
      tileSetLayer.getTileLayers().ready(function(tileLayer1, tileLayer2) {
        var viewport = viewportFactory.getViewport(canvas);
        viewport.add(tileLayer1);
        viewport.add(tileLayer2);
        viewport.drawChecker(canvas, 16);
        viewport.draw();
      });
    }
  };
});
