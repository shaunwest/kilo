/**
 * Created by Shaun on 5/25/14.
 */

jack2d('editor.tileSet', [], function() {
  'use strict';

  return {
    init: function() {
      this.tileGroups = {};
      return this;
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