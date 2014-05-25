/**
 * Created by Shaun on 5/7/14.
 */

jack2d('editor.tileLayerFactory', ['config', 'helper'], function(config, helper) {
  'use strict';

  var tileLayerMethods = {
    init: function(tileSet, layerData, tileWidth, tileHeight) {
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
      this.init(this.tileSet, this.layerData, this.tileWidth, this.tileHeight);
      return this;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
      return this;
    },
    draw: function() {
      var x, y;
      for(x = 0; x < this.layerWidth; x++) {
        for(y = 0; y < this.layerHeight; y++) {
          drawTile(this.context, y * this.tileHeight, x * this.tileWidth, this.layerData[x][y], this.tileSet);
        }
      }
      return this;
    }
  };

  function createTileLayer(canvas) {
    var tileLayer = {
      canvas: canvas,
      context: canvas.getContext('2d')
    };

    return helper.augment(tileLayer, tileLayerMethods);
  }

  function getTileLayer(tileSet, layerData) {
    var tileLayer = createTileLayer(document.createElement('canvas'));

    return tileLayer.init(tileSet, layerData, config.tileWidth, config.tileHeight);
  }

  function getTileGroup(tileData) {
    return (tileData && helper.isArray(tileData)) ? tileData[0] : null;
  }

  function getTileIndex(tileData) {
    return (tileData && helper.isArray(tileData)) ? tileData[1] : null;
  }

  function drawTile(context, px, py, tileData, tileSet) {
    var tileGroup = getTileGroup(tileData),
      tileIndex = getTileIndex(tileData),
      image = tileSet.getTile(tileGroup, tileIndex);

    if(image) {
      context.drawImage(image, 0, 0, config.tileWidth, config.tileHeight, px, py, config.tileWidth, config.tileHeight);
    }
  }

  return {
    getTileLayer: getTileLayer
  };
});