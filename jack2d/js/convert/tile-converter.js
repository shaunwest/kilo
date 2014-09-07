/**
 * Created by shaun on 3/1/14.
 */

jack2d('tileConverter', ['helper', 'appConfig'], function(Helper, appConfig) {
  'use strict';

  //var DEFAULT_TILE_SIZE = 16;

  function makeTiles(image, tileWidth, tileHeight) {
    var rowCount, data = [], i;
    //var tileHeight = appConfig.tileHeight || DEFAULT_TILE_SIZE,
    if(!tileWidth || !tileHeight) {
      Helper.error('Jack2d: TileConverter: missing tile height or tile width.');
    }

    rowCount = Math.floor(image.height / tileHeight);

    for(i = 0; i < rowCount; i++) {
      addRow(data, image, i, tileWidth, tileHeight);
    }

    return data;
  }

  function addRow(result, sourceAsset, row, tileWidth, tileHeight) {
    //var tileWidth = appConfig.tileWidth || DEFAULT_TILE_SIZE,
    //  tileHeight = appConfig.tileHeight || DEFAULT_TILE_SIZE,
    var tileCount = Math.floor(sourceAsset.width / tileWidth),
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
