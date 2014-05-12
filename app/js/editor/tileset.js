/**
 * Created by Shaun on 5/3/14.
 */

jack2d('editorTileset', ['helper', 'promisePool', 'imageLoader', 'tileConverter'],
  function(helper, promisePool, imageLoader, tileConverter) {
  'use strict';

  var tileGroupSources,
    tileGroups,
    obj;

  function init(sources, ready) {
    tileGroupSources = sources || helper.error('Exception: no tile group sources found in tile set');
    tileGroups = {};
    tileGroupSources.forEach(function(tileGroupSource) {
      var promise = imageLoader.loadPath(tileGroupSource.path);
      promise.ready(function(image) {
        tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image);
      });
      promisePool.add(promise);
    });

    promisePool.ready(function() {
      ready(obj);
    });

    return obj;
  }

  function getTileGroup(id) {
    if(helper.isDefined(id)) {
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