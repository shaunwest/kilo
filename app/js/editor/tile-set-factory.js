/**
 * Created by Shaun on 5/3/14.
 */

jack2d('editor.tileSetFactory', ['helper', 'promiser', 'promisePooler', 'imageLoader', 'tileConverter'],
function(helper, promiser, promisePooler, imageLoader, tileConverter) {
  'use strict';

  function getTileSet(sources) {
    var promise = promiser.get(),
      tileSet = {
        tileGroups: {},
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

    loadImages(tileSet, sources, function() {
      promiser.resolve(promise, tileSet);
    });

    return promise;
  }

  function loadImages(tileSet, sources, ready) {
    var promisePool = promisePooler.get();

    sources.forEach(function(tileGroupSource) {
      var promise = imageLoader.loadPath(tileGroupSource.path);
      promise.ready(function(image) {
        tileSet.tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image);
      });
      promisePooler.add(promisePool, promise);
    });

    promisePool.ready(function() {
      ready();
    });
  }

  return {
    getTileSet: getTileSet
  };
});