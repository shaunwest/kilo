/**
 * Created by Shaun on 5/25/14.
 */

jack2d('tileSet', [], function() {
  'use strict';

  return {
    getTileGroup: function(groupId) {
      return this.tileGroups[groupId];
    },
    setTileGroup: function(groupId, group) {
      var tileGroups = (this.tileGroups) ? this.tileGroups : this.tileGroups = {};
      tileGroups[groupId] = group;
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