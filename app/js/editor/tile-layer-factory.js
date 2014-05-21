/**
 * Created by Shaun on 5/7/14.
 */

jack2d('editor.tileLayerFactory', ['config'], function(config) {
  'use strict';

  function get(tileSet, layerData) {
    var tileWidth = config.tileWidth,// FIXME: needs default value
      tileHeight = config.tileHeight,
      layerWidth = layerData.length,
      layerHeight = layerData[0].length,
      pixelWidth = layerWidth * tileWidth,
      pixelHeight = layerHeight * tileHeight,
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      x, y;

    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    context.clearRect(0, 0, pixelWidth, pixelHeight);

    for(x = 0; x < layerWidth; x++) {
      for(y = 0; y < layerHeight; y++) {
        drawTile(context, y * tileHeight, x * tileWidth, layerData[x][y], tileSet);
      }
    }

    return {
      canvas: canvas
    };
  }

  function drawTile(context, px, py, tileData, tileSet) {
    var tileGroup = tileData[0],
      tileIndex = tileData[1],
      image = tileSet.getTile(tileGroup, tileIndex);

    context.drawImage(image, 0, 0, config.tileWidth, config.tileHeight, px, py, config.tileWidth, config.tileHeight);
  }

  return {
    get: get
  };
});