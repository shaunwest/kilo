/**
 * Created by Shaun on 5/25/14.
 */

jack2d('editor.viewport', ['helper', 'canvas.draw'], function(helper, canvasDraw) {
  'use strict';

  return {
    init: function(canvas) {
      this.contentWidth = 128;
      this.contentHeight = 128;
      this.position = {x: 0, y: 0};
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.layers = [];
      this.checkerSize = 0;
      return this;
    },
    addLayer: function(layer) {
      this.contentWidth = Math.max(layer.pixelWidth, this.contentWidth);
      this.contentHeight = Math.max(layer.pixelHeight, this.contentHeight);
      this.setCanvasSize();
      this.layers.push({visible: true, layer: layer});
      return this;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return this;
    },
    getLayer: function(layerIndex) {
      return this.layers[layerIndex];
    },
    hideLayer: function(layerIndex) {
      this.layers[layerIndex].visible = false;
      return this;
    },
    showLayer: function(layerIndex) {
      this.layers[layerIndex].visible = true;
      return this;
    },
    draw: function(layerIndex) {
      var layers = this.layers,
        context = this.context;

      function drawLayer(layer) {
        if(layer.visible) {
          context.drawImage(layer.layer.canvas, 0, 0);
        }
      }

      function drawLayers() {
        var numLayers = layers.length, i;
        for(i = 0; i < numLayers; i++) {
          drawLayer(layers[i]);
        }
      }

      if(this.checkerSize) {
        canvasDraw.checkerBackground(this.canvas, this.checkerSize); //FIXME update to new spec
      }

      if(helper.isDefined(layerIndex)) {
        drawLayer(layers[layerIndex]);
      } else {
        drawLayers();
      }

      return this;
    },
    setCanvasSize: function() {
      this.canvas.width = this.contentWidth;
      this.canvas.height = this.contentHeight;
    },
    checker: function(size) {
      this.checkerSize = size;
      return this;
    },
    getPosition: function() {
      return this.position;
    },
    setPosition: function(x, y) {
      this.position.x = x;
      this.position.y = y;
      this.canvas.style.left = -x + 'px';
      this.canvas.style.top = -y + 'px';
      return this;
    }
  };
});

