/**
 * Created by Shaun on 5/25/14.
 */

jack2d('TileSet', ['imageLoader', 'tileConverter'], function(imageLoader, tileConverter) {
  'use strict';

  return {
    loadTileSet: function(sources) {
      var tileGroups, promises = [];

      tileGroups = (this.tileGroups) ? this.tileGroups : this.tileGroups = {};

      sources.forEach(function(tileGroupSource) {
        var promise = imageLoader.loadPath(tileGroupSource.path);
        promise.then(function(image) {
          tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image);
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