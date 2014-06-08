/**
 * Created by Shaun on 5/3/14.
 */

jack2d('editor.tileSetFactory',
['helper', 'imageLoader', 'tileConverter', 'editor.tileSet'],
function(helper, imageLoader, tileConverter, tileSet) {
  'use strict';

  return function(sources) {
    return new Promise(function(resolve, reject) {
      var  tileSet = createTileSet();

      loadImages(tileSet, sources).then(function() {
        resolve(tileSet);
      });
    });
  };

  function createTileSet() {
    return helper.clone(tileSet).init();
  }

  function loadImages(tileSet, sources) {
    var promises = [];
    sources.forEach(function(tileGroupSource) {
      var promise = imageLoader.loadPath(tileGroupSource.path);
      promise.then(function(image) {
        tileSet.tileGroups[tileGroupSource.id] = tileConverter.makeTiles(image);
      });
      promises.push(promise);
    });

    return Promise.all(promises);
  }
});