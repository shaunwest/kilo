/**
 * Created by Shaun on 5/3/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.levelEditorTileset = function(sources) {
      var tileGroupSources = sources ||
        retro2d.error('Exception: no tile group sources found in tile set'),
      tileGroups;

    init();

    function init() {
      tileGroups = {};
      tileGroupSources.forEach(function(tileGroupSource) {
        retro2d.imageLoader.loadPath(tileGroupSource.path).ready(function(image) {
          tileGroups[tileGroupSource.id] = image;
        });
      });
    }

    function getTileGroup(id) {
      if(retro2d.isDefined(id)) {
        return tileGroups[id];
      }
      return null;
    }

    function getTile(groupId, tileX, tileY) {
      var tileGroup = getTileGroup(groupId);
      return tileGroup[tileX][tileY];
    }

    return {
      getTileGroup: getTileGroup
    };
  };
})();