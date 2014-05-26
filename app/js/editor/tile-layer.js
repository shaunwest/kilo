/**
 * Created by Shaun on 5/25/14.
 */

jack2d('editor.tileLayer', ['config', 'helper'], function(config, helper) {
  'use strict';

  function getTileGroup(tileData) {
    return (tileData && helper.isArray(tileData)) ? tileData[0] : null;
  }

  function getTileIndex(tileData) {
    return (tileData && helper.isArray(tileData)) ? tileData[1] : null;
  }

  function getTile(tileData, tileSet) {
    var tileGroup = getTileGroup(tileData),
      tileIndex = getTileIndex(tileData);
    return tileSet.getTile(tileGroup, tileIndex);
  }

  function drawTile(context, x, y, tileData, tileSet) {
    var image = getTile(tileData, tileSet);

    if(image) {
      context.drawImage(
        image,
        0, 0,
        config.tileWidth, config.tileHeight,
        x, y,
        config.tileWidth, config.tileHeight
      );
    }
  }

  return {
    init: function(canvas, tileSet, layerData, tileWidth, tileHeight) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
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
    },
    refresh: function() {
      this.init(this.canvas, this.tileSet, this.layerData, this.tileWidth, this.tileHeight);
      return this;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
      return this;
    },
    draw: function() {
      var tx, ty;
      for(tx = 0; tx < this.layerWidth; tx++) {
        for(ty = 0; ty < this.layerHeight; ty++) {
          drawTile(
            this.context,
            ty * this.tileHeight, tx * this.tileWidth,
            this.layerData[tx][ty],
            this.tileSet
          );
        }
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
    }
  };
});