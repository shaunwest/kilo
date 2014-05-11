/**
 * Created by shaun on 3/9/14.
 */

var editor = editor || {};

editor.layerRenderer = (function() {
  'use strict';
  var GROUP_INDEX = 0,
      TILE_INDEX = 1,
      layers = null;

  /*function createLayer(layerData, tileSet)  {
    if(!layers) {
      layers = [];
    }

    layers.push({
      canvas: document.createElement('canvas'),
      tileSet: tileSet,
      data: layerData
    })
  }*/

  function drawTiles(top, left, tileData, context2d) {
    var groupId   = tileData[GROUP_INDEX],
        group     = tileSet[groupId],
        coords    = tileData[TILE_INDEX],
        tileAsset = null;

    if(coords) {
      tileAsset = group[coords.x][coords.y];
      context2d.drawImage(tileAsset, left, top);
    } else {
      drawTileGroup(top, left, group);
    }
  }

  function drawTileGroup(top, left, group, context2d) {
    var width = group.length,
      height = group[0].length,
      x = 0,
      y = 0;

    for(; x < width; i++) {
      for(; y < height; j++) {
        context2d.drawImage(group[x][y], left, top);
      }
    }
  }

  function drawLayer(layer) {
    var data      = layer.data,
      tileSet   = layer.tileSet,
      width     = data.length,
      height    = data[0].length,
      context2d = layer.canvas.getContext('2d'),
      tileData  = null,
      groupId   = null,
      group     = null,
      tile      = null,
      tileId    = null,
      i         = 0,
      j         = 0;

    for(; i < width; i++) {
      for(; j < height; j++) {
        drawTiles(i * 16, j * 16, data[i][j]);
      }
    }
  }

  return {
    drawLayer: drawLayer
  };
})();

