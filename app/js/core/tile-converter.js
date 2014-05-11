/**
 * Created by shaun on 3/1/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.tileConverter = function(c) {
    var config = c || {},
      tileWidth = config.tileWidth || 16,
      tileHeight = config.tileHeight || 16;

    function makeTiles(image) {
      var rowCount = Math.floor(image.height / tileHeight),
        i = 0,
        data = [];

      for(; i < rowCount; i++) {
        addRow(data, image, i);
      }

      return data;
    }

    function addRow(result, sourceAsset, row) {
      var tileCount = Math.floor(sourceAsset.width / tileWidth),
        tile = null,
        tileContext = null,
        i = 0;

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

        result.push(tile);
      }
    }

    return {
      makeTiles: makeTiles
    };
  };
})();
