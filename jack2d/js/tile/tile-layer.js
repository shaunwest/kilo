/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileLayer', ['helper'], function(Helper) {
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

  return {
    /*init: function(tileSet, layerData, tileWidth, tileHeight) {
      this.canvas = document.createElement('canvas'); //canvas;
      this.context = this.canvas.getContext('2d');
      this.layerData = layerData;
      this.tileSet = tileSet;
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
      this.layerWidth = layerData.length;
      this.layerHeight = layerData[0].length;
      this.pixelWidth = this.layerWidth * tileWidth;
      this.pixelHeight = this.layerHeight * tileHeight;

      this.canvas.width = this.pixelWidth;
      this.canvas.height = this.pixelHeight;
      return this;
    },*/
    setLayerData: function(value) {
      var layerData;

      layerData = (value) ?
        this.layerData = value :
        this.layerData;

      if(!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
      }

      this.layerWidth = layerData.length;
      this.layerHeight = layerData[0].length;

      return this;
    },
    resizeCanvas: function() {
      this.canvas.width = this.layerWidth * this.tileWidth;
      this.canvas.height = this.layerHeight * this.tileHeight;
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
    getPixelWidth: function() {
      return this.layerWidth * this.tileWidth;
    },
    getPixelHeight: function() {
      return this.layerHeight * this.tileHeight;
    },
    /*refresh: function() {
      this.init(this.tileSet, this.layerData, this.tileWidth, this.tileHeight);
      return this;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
      return this;
    },*/
    draw: function() {
      var tx, ty;

      //this.resizeCanvas();

      for(tx = 0; tx < this.layerWidth; tx++) {
        for(ty = 0; ty < this.layerHeight; ty++) {
          this.drawTile(
            ty * this.tileHeight,
            tx * this.tileWidth,
            this.layerData[tx][ty]
          );
        }
      }
      return this;
    },
    drawTile: function(x, y, tileData) {
      var image = getTile(tileData, this.tileSet);

      if(image) {
        this.context.drawImage(
          image,
          0, 0,
          this.tileWidth, this.tileHeight,
          x, y,
          this.tileWidth, this.tileHeight
        );
      }
      return this;
    },
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