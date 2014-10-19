/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileLayer', ['helper', 'Canvas', 'Requires'], function(Helper, Canvas, Requires) {
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
      var layerData = this.layerData = value;

      this.tileGridWidth = layerData[0].length;
      this.tileGridHeight = layerData.length;
      this.segmentGridWidth = this.tileGridWidth / 2;
      this.segmentGridHeight = this.tileGridHeight / 2;

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
      return this.tileGridWidth * this.tileWidth;
    },
    getLayerHeight: function() {
      return this.tileGridHeight * this.tileHeight;
    },
    draw: Requires(['layerData'], function(context, viewport) {
      var tx, ty;
      var tileWidth = this.tileWidth;
      var tileHeight = this.tileHeight;
      var layerData = this.layerData;
      var xMin = Math.max(Math.floor(viewport.x / tileWidth), 0);
      var yMin = Math.max(Math.floor(viewport.y / tileHeight), 0);
      var xMax = Math.min(xMin + Math.ceil(viewport.width / tileWidth), this.tileGridWidth);
      var yMax = Math.min(yMin + Math.ceil(viewport.height / tileHeight), this.tileGridHeight);

      Canvas.drawBackground(context,this.getLayerWidth(), this.getLayerHeight(), -viewport.x, -viewport.y, 'white');

      for(tx = xMin; tx < xMax; tx++) {
        for(ty = yMin; ty < yMax; ty++) {
          drawTile(
            context,
            (tx * tileWidth) - viewport.x,
            (ty * tileHeight) - viewport.y,
            tileWidth,
            tileHeight,
            layerData[ty][tx],
            this.tileSet
          );
          //Canvas.drawBorder(context, tileWidth, tileHeight, (tx * tileWidth) - viewport.x, (ty * tileHeight) - viewport.y);
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