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

  function clearContext(context, width, height) {
    context.clearRect(0, 0, width, height);
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

      if(!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
      }

      return this;
    },
    resizeCanvas: function() {
      this.canvas.width = this.gridWidth * this.tileWidth;
      this.canvas.height = this.gridHeight * this.tileHeight;
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
    /*refresh: function() {
      this.init(this.tileSet, this.layerData, this.tileWidth, this.tileHeight);
      return this;
    },*/
    clear: function() {
      if(this.context) {
        clearContext(this.context, this.getLayerWidth(), this.getLayerHeight());
      }
      return this;
    },
    draw: Requires(['layerData', 'context'], function() {
      var tx, ty, gridWidth, gridHeight;
      var tileWidth = this.tileWidth;
      var tileHeight = this.tileHeight;
      var layerData = this.layerData;

      clearContext(this.context, this.getLayerWidth(), this.getLayerHeight());

      for(tx = 0, gridWidth = this.gridWidth; tx < gridWidth; tx++) {
        for(ty = 0, gridHeight = this.gridHeight; ty < gridHeight; ty++) {
          this.drawTile(
            ty * tileHeight,
            tx * tileWidth,
            tileWidth,
            tileHeight,
            layerData[tx][ty]
          );
        }
      }
      return this;
    }),
    drawTile: Requires(['tileSet', 'context'], function(x, y, tileWidth, tileHeight, tileData) {
      var image = getTile(tileData, this.tileSet);

      if(image) {
        this.context.drawImage(
          image,
          0, 0,
          tileWidth, tileHeight,
          x, y,
          tileWidth, tileHeight
        );
      }
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
    getLayer: function() {
      return this.canvas;
    },
    setTile: function(tx, ty, tileGroupId, tileIndex) {
      this.layerData[ty][tx] = [tileGroupId, tileIndex];
      return this;
    }
  };
});