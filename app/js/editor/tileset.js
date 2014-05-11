/**
 * Created by Shaun on 5/3/14.
 */

jack2d('levelEditorTileset', ['jack2d'], function(jack2d) {
  'use strict';

  var tileGroupSources,
    tileGroups,
    obj;

  function init(sources, ready) {
    var promisePool = jack2d.promisePool;

    tileGroupSources = sources || jack2d.error('Exception: no tile group sources found in tile set');
    tileGroups = {};
    tileGroupSources.forEach(function(tileGroupSource) {
      var promise = jack2d.imageLoader.loadPath(tileGroupSource.path);
      promise.ready(function(image) {
        tileGroups[tileGroupSource.id] = jack2d.tileConverter.makeTiles(image);
      });
      promisePool.add(promise);
    });

    promisePool.ready(function() {
      ready(obj);
    });

    return obj;
  }

  function getTileGroup(id) {
    if(jack2d.isDefined(id)) {
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
    init: init,
    getTileGroup: getTileGroup,
    getTile: getTile
  };

  return obj;
});