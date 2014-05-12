/**
 * Created by Shaun on 5/7/14.
 */

jack2d('editorTileLayer', [], function() {
  'use strict';

  var obj,
    tileSize = 16,
    tileSet,
    layerData,
    canvas,
    context;

  function init(config) {
    var c = config || {};

    tileSize = c.tileSize || 16;
    tileSet = c.tileSet;
    layerData = c.layerData;
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');

    createLayer(tileSize, tileSet, layerData);

    return obj;
  }

  function createLayer(tileSize, tileSet, layerData) {
    var layerWidth = layerData.length,
      layerHeight = layerData[0].length,
      width = layerWidth * tileSize,
      height = layerHeight * tileSize,
      x, y;

    context.clearRect(0, 0, width, height);

    for(x = 0; x < layerWidth; x++) {
      for(y = 0; y < layerHeight; y++) {
        drawTile(context, y * tileSize, x * tileSize, tileSize, layerData[x][y], tileSet);
      }
    }
  }

  function drawTile(context, px, py, tileSize, tileData, tileSet) {
    var tileGroup = tileData[0],
      tileIndex = tileData[1],
      image = tileSet.getTile(tileGroup, tileIndex);

    context.drawImage(image, 0, 0, tileSize, tileSize, px, py, tileSize, tileSize);
  }

  function writeToCanvas(targetCanvas) {
    var context = targetCanvas.getContext('2d');
    context.drawImage(canvas, 0, 0);
  }

  obj = {
    init: init,
    createLayer: createLayer,
    writeToCanvas: writeToCanvas
  };

  return obj;
});