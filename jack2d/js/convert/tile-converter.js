/**
 * Created by shaun on 3/1/14.
 */

jack2d('tileConverter', ['appConfig'], function(appConfig) {
  'use strict';

  var DEFAULT_TILE_SIZE = 16;

  function makeTiles(image) {
    var tileHeight = appConfig.tileHeight || DEFAULT_TILE_SIZE,
      rowCount = Math.floor(image.height / tileHeight),
      data = [],
      i;

    for(i = 0; i < rowCount; i++) {
      addRow(data, image, i);
    }

    return data;
  }

  function addRow(result, sourceAsset, row) {
    var tileWidth = appConfig.tileWidth || DEFAULT_TILE_SIZE,
      tileHeight = appConfig.tileHeight || DEFAULT_TILE_SIZE,
      tileCount = Math.floor(sourceAsset.width / tileWidth),
      tile = null,
      tileContext = null,
      i;

    for(i = 0; i < tileCount; i++) {
      tile = document.createElement('canvas');
      tile.width  = tileWidth;
      tile.height = tileHeight;

      tileContext = tile.getContext('2d');
      tileContext.drawImage(
        sourceAsset, i * tileWidth, row * tileHeight,
        tileWidth, tileHeight,
        0, 0,
        tileWidth, tileHeight
      );

      result.push(tile);
    }
  }

  return {
    makeTiles: makeTiles
  };
});