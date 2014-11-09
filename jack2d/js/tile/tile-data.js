/**
 * Created by Shaun on 11/2/2014.
 */

jack2d('TileData', ['Util'], function(Util) {
  'use strict';

  function TileData(tileData) {
    this.tileData = tileData || null;
  }

  TileData.prototype.setTileData = function(tileData) {
    this.tileData = tileData;
  };

  TileData.prototype.setTileSet = function(tileSet) {
    this.tileSet = tileSet;
  };

  TileData.prototype.getTileGroup = function(tileId) {
    // TODO: all of these checks are ridiculous
    // maybe validate the data before doing this stuff?
    return (tileId && Util.isArray(tileId)) ? tileId[0] : null;
  };

  TileData.prototype.getTileIndex = function(tileId) {
    return (tileId && Util.isArray(tileId)) ? tileId[1] : null;
  };

  TileData.prototype.getTileWidth = function() {
    return this.tileSet.tileWidth;
  };

  TileData.prototype.getTileHeight = function() {
    return this.tileSet.tileHeight;
  };

  TileData.prototype.getGridWidth = function() {
    return this.tileData[0].length;
  };

  TileData.prototype.getGridHeight = function() {
    return this.tileData.length;
  };

  TileData.prototype.getTile = function(tx, ty) {
    var tileId = this.tileData[ty][tx];
    var tileGroup = this.getTileGroup(tileId),
      tileIndex = this.getTileIndex(tileId);
    return this.tileSet.getTile(tileGroup, tileIndex);
  };

  TileData.prototype.setTile = function(tx, ty, tileId) {
    this.tileData[ty][tx] = tileId;
  };

  return TileData;
});