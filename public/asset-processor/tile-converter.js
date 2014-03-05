/**
 * Created by shaun on 3/1/14.
 */


var assetProcessor = assetProcessor || {};

assetProcessor.tileConverter = (function() {
  var tileWidth   = 16,
      tileHeight  = 16;

  function makeTileGroup(assetUrl, callback) {
    var sourceAsset = new Image(),
        tileGroup   = [];

    sourceAsset.src = 'ultradian/sources/' + assetUrl;
    sourceAsset.onload = function() {
      var rowCount  = Math.floor(sourceAsset.height / tileHeight),
          i         = 0;

      for(; i < rowCount; i++) {
        tileGroup.push(getRow(sourceAsset, i));
      }

      if(callback) {
        callback(tileGroup);
      }
    };
  }

  function getRow(sourceAsset, row) {
    var tileCount   = Math.floor(sourceAsset.width / tileWidth),
        tiles       = [],
        tile        = null,
        tileContext = null,
        i           = 0;

    for(; i < tileCount; i++) {
      tile = document.createElement("canvas");
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
    makeTileGroup: makeTileGroup
  };

})();
