/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileLayer', ['helper', 'Requires'], function(Helper, Requires) {
  'use strict';

  function getTileGroup(tileData) {
    return (tileData && Helper.isArray(tileData)) ? tileData[0] : null;
  }

  function getTileIndex(tileData) {
    return (tileData && Helper.isArray(tileData)) ? tileData[1] : null;
  }

  function getTile(tileData, tileSet) {
    var tileGroup = getTileGroup(tileData),
      tileIndex = getTileIndex(tileData);
    return tileSet.getTile(tileGroup, tileIndex);
  }

  function drawTile(context, x, y, tileWidth, tileHeight, tileData, tileSet) {
    var image = getTile(tileData, tileSet);

    if(image) {
      context.drawImage(
        image,
        0, 0,
        tileWidth, tileHeight,
        x, y,
        tileWidth, tileHeight
      );
    }
  }

  return {
    setLayerData: function(value) {
      var layerData;

      layerData = this.layerData = value;
      /*layerData = (value) ?
        this.layerData = value :
        this.layerData;*/

      this.gridWidth = layerData.length;
      this.gridHeight = layerData[0].length;

      return this;
    },
    setTileSet: function(value) {
      this.tileSet = value;
      this.tileWidth = this.tileSet.tileWidth;
      this.tileHeight = this.tileSet.tileHeight;
      return this;
    },
    setTileWidth: function(value) {
      this.tileWidth = value;
      return this;
    },
    setTileHeight: function(value) {
      this.tileHeight = value;
      return this;
    },
    getLayerWidth: function() {
      return this.gridWidth * this.tileWidth;
    },
    getLayerHeight: function() {
      return this.gridHeight * this.tileHeight;
    },
    // TODO: Need to support viewport...
    draw: Requires(['layerData'], function(context, viewport) {
      var tx, ty, gridWidth, gridHeight;
      var tileWidth = this.tileWidth;
      var tileHeight = this.tileHeight;
      var layerData = this.layerData;

      for(tx = 0, gridWidth = this.gridWidth; tx < gridWidth; tx++) {
        for(ty = 0, gridHeight = this.gridHeight; ty < gridHeight; ty++) {
          drawTile(
            context,
            ty * tileHeight,
            tx * tileWidth,
            tileWidth,
            tileHeight,
            layerData[tx][ty],
            this.tileSet
          );
        }
      }
      return this;
    }),
    drawTile: Requires(['tileSet'], function(context, x, y, tileWidth, tileHeight, tileData) {
      drawTile(context, x, y, tileWidth, tileHeight, tileData, this.tileSet);
      return this;
    }),
    getTileByPixels: function(x, y) {
      var tx = Math.floor(x / this.tileWidth),
        ty = Math.floor(y / this.tileHeight);

      return this.getTile(tx, ty);
    },
    getTile: function(tx, ty) {
      return getTile(this.layerData[ty][tx], this.tileSet);
    },
    setTile: function(tx, ty, tileGroupId, tileIndex) {
      this.layerData[ty][tx] = [tileGroupId, tileIndex];
      return this;
    }
  };
});