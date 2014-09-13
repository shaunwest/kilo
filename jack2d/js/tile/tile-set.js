/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileSet', ['imageLoader', 'tileConverter'], function(imageLoader, tileConverter) {
  'use strict';

  var DEFAULT_TILE_SIZE = 16;

  return {
    setTileWidth: function(value) {
      this.tileWidth = value;
      return this;
    },
    setTileHeight: function(value) {
      this.tileHeight = value;
      return this;
    },
    loadTileSet: function(sources) {
      var tileGroups, tileWidth, tileHeight, promises = [];

      tileWidth = (this.tileWidth) ? this.tileWidth : this.tileWidth = DEFAULT_TILE_SIZE;
      tileHeight = (this.tileHeight) ? this.tileHeight : this.tileHeight = DEFAULT_TILE_SIZE;
      tileGroups = (this.tileGroups) ? this.tileGroups : this.tileGroups = {};

      sources.forEach(function(tileGroupSource) {
        var promise = imageLoader.loadPath(tileGroupSource.path);
        promise.then(function(image) {
          tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image, tileWidth, tileHeight);
        });
        promises.push(promise);
      });

      return Promise.all(promises);
    },
    setTileGroup: function(groupId, group) {
      var tileGroups = (this.tileGroups) ? this.tileGroups : this.tileGroups = {};
      tileGroups[groupId] = group;
    },
    getTileGroup: function(groupId) {
      return this.tileGroups[groupId];
    },
    getTile: function(groupId, tileIndex) {
      var tileGroup = this.getTileGroup(groupId);
      if(tileGroup) {
        return tileGroup[tileIndex];
      }
      return null;
    }
  };
});