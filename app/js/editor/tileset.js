/**
 * Created by Shaun on 5/3/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.levelEditorTileset = function(sources, ready) {
      var tileGroupSources = sources || retro2d.error('Exception: no tile group sources found in tile set'),
        tileGroups,
        obj;

    init();

    function init() {
      var promisePool = retro2d.promisePool();

      tileGroups = {};
      tileGroupSources.forEach(function(tileGroupSource) {
        var promise = retro2d.imageLoader().loadPath(tileGroupSource.path);
        promise.ready(function(image) {
          tileGroups[tileGroupSource.id] = retro2d.tileConverter().makeTiles(image);
        });
        promisePool.add(promise);
        //promisePool.add(retro2d.imageLoader().loadPath, tileGroupSource.path);
        /*retro2d.imageLoader().loadPath(tileGroupSource.path).ready(function(image) {
          tileGroups[tileGroupSource.id] = retro2d.tileConverter().makeTiles(image);
        });*/
      });

      promisePool.ready(function() {
        ready(obj);
      });
    }

    function getTileGroup(id) {
      if(retro2d.isDefined(id)) {
        return tileGroups[id];
      }
      return null;
    }

    function getTile(groupId, tileIndex) {
      var tileGroup = getTileGroup(groupId);
      if(tileGroup && tileGroup[tileIndex]) {
        return tileGroup[tileIndex];
      }
      return null;
    }

    obj = {
      getTileGroup: getTileGroup,
      getTile: getTile
    };
  };
})();