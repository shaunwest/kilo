/**
 * Created by Shaun on 5/3/14.
 */

jack2d('editor.tileSetFactory',
['helper', 'promiser', 'promisePooler', 'imageLoader', 'tileConverter', 'editor.tileSet'],
function(helper, promiser, promisePooler, imageLoader, tileConverter, tileSet) {
  'use strict';

  return function(sources) {
    var promise = promiser.get(),
      tileSet = createTileSet();

    loadImages(tileSet, sources, function() {
      promiser.resolve(promise, tileSet);
    });

    return promise;
  };

  function createTileSet() {
    return helper.clone(tileSet).init();
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
});