/**
 * Created by Shaun on 5/3/14.
 */

jack2d('editor.tileSetFactory',
['helper', 'promisePooler', 'imageLoader', 'tileConverter', 'editor.tileSet'],
function(helper, promisePooler, imageLoader, tileConverter, tileSet) {
  'use strict';

  return function(sources) {
    return new Promise(function(resolve, reject) {
      var  tileSet = createTileSet();

      loadImages(tileSet, sources, function() {
        resolve(tileSet);
      });
    });
  };

  function createTileSet() {
    return helper.clone(tileSet).init();
  }

  function loadImages(tileSet, sources, ready) {
    var promisePool = promisePooler.get();

    sources.forEach(function(tileGroupSource) {
      var promise = imageLoader.loadPath(tileGroupSource.path);
      promise.then(function(image) {
        tileSet.tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image);
      });
      promisePooler.add(promisePool, promise);
    });

    promisePool.ready(function() {
      ready();
    });
  }
});