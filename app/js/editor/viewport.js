/**
 * Created by shaun on 4/23/14.
 */

jack2d('editor.viewportFactory', ['config'], function(config) {
  'use strict';

  var CHECKER_COLOR = 'rgba(184,184,184,0.5)'; // grey

  function get(canvas) {
    var context = canvas.getContext('2d');
    return {
      layers: [],
      add: function(layer) {
        this.layers.push(layer);
      },
      draw: function(checker) {
        var i, layers = this.layers, numLayers = layers.length;
        if(checker) {
          drawBackground(canvas);
        }
        for(i = 0; i < numLayers; i++) {
          context.drawImage(layers[i].canvas, 0, 0);
        }
      }
    };
  }

  function drawBackground(canvas) {
    var width = canvas.width,
      height = canvas.height,
      tileWidth = config.tileWidth,
      tileHeight = config.tileHeight,
      widthInTiles = width / tileWidth,
      heightInTiles = height / tileHeight,
      context = canvas.getContext('2d'),
      offset,
      i, j;

    context.clearRect(0, 0, width, height);
    context.fillStyle = CHECKER_COLOR;

    for(i = 0; i < widthInTiles; i++) {
      offset = i % 2;
      for(j = 0; j < heightInTiles; j++) {
        if(j % 2 === 0) {
          context.fillRect(i * tileWidth, (j + offset) * tileHeight, tileWidth, tileHeight);
        }
      }
    }
  }

  return {
    get: get
  };
});

