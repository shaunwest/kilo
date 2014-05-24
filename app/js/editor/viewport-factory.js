/**
 * Created by shaun on 4/23/14.
 */

jack2d('editor.viewportFactory', ['config', 'helper', 'canvas.draw'], function(config, helper, canvasDraw) {
  'use strict';

  var viewportMethods = {
    add: function(layer) {
      this.layers.push(layer);
    },
    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    draw: function() {
      var layers = this.layers,
        numLayers = layers.length,
        i;
      for(i = 0; i < numLayers; i++) {
        this.context.drawImage(layers[i].canvas, 0, 0);
      }
    },
    clearAndDraw: function() {
      this.clear();
      this.draw();
    },
    drawChecker: canvasDraw.checkerBackground
  };

  function getViewport(canvas) {
    var viewport =  {
      canvas: canvas,
      context: canvas.getContext('2d'),
      layers: []
    };
    return helper.mixin(viewport, viewportMethods);
  }

  return {
    getViewport: getViewport
  };
});

