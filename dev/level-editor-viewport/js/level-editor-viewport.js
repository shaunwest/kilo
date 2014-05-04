/**
 * Created by shaun on 4/23/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.levelEditorViewport = function(c) {
    var CHECKER_COLOR = 'rgba(184,184,184,0.5)', // grey
      config = c || {},
      canvas = config.canvas || retro2d.error('Exception: config property \'canvas\' is required.'),
      context = canvas.getContext('2d'),
      tileSize = config.tileSize || 16,
      layers = config.layers,
      tileSet = config.tileSet,
      width = 0,
      height = 0,
      widthInTiles = 0,
      heightInTiles = 0;

    refresh();

    function refresh() {
      setDims();
      create();
    }

    function setDims() {
      width = canvas.width;
      height = canvas.height;
      widthInTiles = Math.ceil(width / tileSize);
      heightInTiles = Math.ceil(height / tileSize);
    }

    function create() {
      createBackground();
      if(layers) {
        createLayers(layers);
      }
    }

    function createBackground() {
      var offset,
        i, j;

      context.clearRect(0, 0, width, height);
      context.fillStyle = CHECKER_COLOR;

      for(i = 0; i < widthInTiles; i++) {
        offset = i % 2;
        for(j = 0; j < heightInTiles; j++) {
          if(j % 2 === 0) {
            context.fillRect(i * tileSize, (j + offset) * tileSize, tileSize, tileSize);
          }
        }
      }
    }

    function createLayers(layers) {
      Array.forEach(layers, function(layer) {
        createLayer(layer.data);
      });
    }

    function createLayer(layerData) {
      var layerWidth = layerData.length,
        layerHeight = layerData[0].length,
        x, y;

      for(x = 0; x < layerWidth; x++) {
        for(y = 0; y < layerHeight; y++) {

        }
      }
    }

    return {
      refresh: refresh,
      setTileSize: function(value) {
        tileSize = value;
        refresh();
      }
    };
  };
})();

