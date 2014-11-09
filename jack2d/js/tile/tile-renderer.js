/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileRenderer', ['Util', 'Extend', 'Requires', 'TileData'], function(Util, Extend, Requires, TileData) {
  'use strict';

  function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    return canvas;
  }

  function drawTile(context2d, x, y, tileData, tx, ty) {
    var tileWidth = tileData.getTileWidth();
    var tileHeight = tileData.getTileHeight();
    var image = tileData.getTile(tx, ty);

    if(image) {
      context2d.drawImage(
        image,
        0, 0,
        tileWidth, tileHeight,
        x, y,
        tileWidth, tileHeight
      );
    }
  }

  function drawTiles(context2d, viewport, tileData, offsetX, offsetY) {
    var tx, ty;
    var tileWidth = tileData.getTileWidth();
    var tileHeight = tileData.getTileHeight();
    var xMin = Math.max(Math.floor(viewport.x / tileWidth), 0);
    var yMin = Math.max(Math.floor(viewport.y / tileHeight), 0);
    var xMax = Math.min(xMin + Math.ceil(viewport.width / tileWidth), tileData.getGridWidth());
    var yMax = Math.min(yMin + Math.ceil(viewport.height / tileHeight), tileData.getGridHeight());

    for(tx = xMin; tx < xMax; tx++) {
      for(ty = yMin; ty < yMax; ty++) {
        drawTile(
          context2d,
          (tx * tileWidth) - offsetX,
          (ty * tileHeight) - offsetY,
          tileData,
          tx, ty
        );
      }
    }
  }

  return Extend('Element', {
    elPromise: function(elPromise, elementOrSelector) {
      return elPromise
        .call(this, elementOrSelector)
        .then(function(element) {
          if(element.getContext) {
            this.canvas = element;
            this.canvasContext = element.getContext('2d');
            this.buffer = createCanvas(element.width, element.height);
            this.bufferContext = this.buffer.getContext('2d');
            this.initialDraw = false;
          } else {
            throw new Error('Jack2d: ImageRenderer: Image element required');
          }
          this.onFrame(this.updateRenderer, 'tile-renderer');
        }.bind(this));
    },
    setViewport: function(viewport) {
      this.viewport = viewport;
      this.lastX = viewport.x;
      this.lastY = viewport.y;
      return this;
    },
    setData: function(value) {
      if(!this.tileData) {
        this.tileData = new TileData(value);
      } else {
        this.tileData.setTileData(value);
      }
      return this;
    },
    setTileSet: function(tileSet) {
      if(!this.tileData) {
        this.tileData = new TileData();
      }
      tileSet.tileSetPromise.then(function() {
        this.tileSetReady = true;
      }.bind(this));

      this.tileData.setTileSet(tileSet);
      return this;
    },
    updateRenderer: Requires(['canvasContext', 'viewport', 'tileData', 'tileSetReady'], function() {
      var viewport = this.viewport;
      var xDelta = viewport.x - this.xLast;
      var yDelta = viewport.y - this.yLast;
      var xDeltaAbs = Math.abs(xDelta);
      var yDeltaAbs = Math.abs(yDelta);
      var xViewRegion = {}; // TODO: performance: causes garbage collection
      var yViewRegion = {};

      if(!this.initialDraw || xDeltaAbs >= viewport.width || yDeltaAbs >= viewport.height) {
        this.initialDraw = true;
        this.bufferContext.clearRect(0, 0, viewport.width, viewport.height);
        drawTiles(this.bufferContext, viewport, this.tileData, viewport.x, viewport.y);
      } else if(xDeltaAbs || yDeltaAbs) {
        this.bufferContext.clearRect(0, 0, viewport.width, viewport.height);
        this.bufferContext.drawImage(this.canvas, -xDelta, -yDelta);

        // TODO: performance: some tiles are drawn twice when there's both an x & y delta
        if(xDelta > 0) {
          xViewRegion.width = xDeltaAbs;
          xViewRegion.x = viewport.x + viewport.width - xDeltaAbs;
          xViewRegion.y = viewport.y;
          xViewRegion.height = viewport.height;
          drawTiles(this.bufferContext, xViewRegion, this.tileData, viewport.x, viewport.y);
        } else if(xDelta < 0) {
          xViewRegion.width = xDeltaAbs;
          xViewRegion.x = viewport.x;
          xViewRegion.y = viewport.y;
          xViewRegion.height = viewport.height;
          drawTiles(this.bufferContext, xViewRegion, this.tileData, viewport.x, viewport.y);
        }

        if(yDelta > 0) {
          yViewRegion.height = yDeltaAbs;
          yViewRegion.y = viewport.y + viewport.height - yDeltaAbs;
          yViewRegion.x = viewport.x;
          yViewRegion.width = viewport.width;
          drawTiles(this.bufferContext, yViewRegion, this.tileData, viewport.x, viewport.y);
        } else if(yDelta < 0) {
          yViewRegion.height = yDeltaAbs;
          yViewRegion.y = viewport.y;
          yViewRegion.x = viewport.x;
          yViewRegion.width = viewport.width;
          drawTiles(this.bufferContext, yViewRegion, this.tileData, viewport.x, viewport.y);
        }
      }

      this.canvasContext.clearRect(0, 0, viewport.width, viewport.height);
      this.canvasContext.drawImage(this.buffer, 0, 0);

      this.xLast = viewport.x;
      this.yLast = viewport.y;
      return this;
    }),
    getTileByPixels: function(x, y) {
      var tx = Math.floor(x / this.tileData.getTileWidth()),
        ty = Math.floor(y / this.tileData.getTileHeight());

      return this.getTile(tx, ty);
    },
    getTile: function(tx, ty) {
      return this.tileData.getTile(tx, ty);
    },
    setTile: function(tx, ty, tileGroupId, tileIndex) {
      this.tileData.setTile(tx, ty, [tileGroupId, tileIndex]);
      return this;
    }
  });
});