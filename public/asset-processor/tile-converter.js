/**
 * Created by shaun on 3/1/14.
 */


var assetProcessor = assetProcessor || {};

assetProcessor.tileConverter = (function() {
  'use strict';

  var tileWidth   = 16,
      tileHeight  = 16;

  /*function makeTileGroup(assetUrl, tileGroup) {
    var sourceAsset = new Image();
        //tileGroup   = [];

    sourceAsset.onload = function() {
      var rowCount  = Math.floor(sourceAsset.height / tileHeight),
          i         = 0;

      for(; i < rowCount; i++) {
        tileGroup.data.push(getRow(sourceAsset, i));
      }

      tileGroup.ready = true;
      //if(callback) {
      //  callback(tileGroup);
      //}
    };

    sourceAsset.src = 'ultradian/sources/' + assetUrl;
  }*/

  function makeTiles(image) {
    var rowCount  = Math.floor(image.height / tileHeight),
        i         = 0,
        data      = [];

    for(; i < rowCount; i++) {
      data.push(getRow(image, i));
    }

    return data;
  }

  function getRow(sourceAsset, row) {
    var tileCount   = Math.floor(sourceAsset.width / tileWidth),
        tiles       = [],
        tile        = null,
        tileContext = null,
        i           = 0;

    for(; i < tileCount; i++) {
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

      tiles.push(tile);
    }

    return tiles;
  }

  return {
    makeTiles: makeTiles
  };

})();
