/**
 * Created by Shaun on 5/1/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.imageLoader = function(waitInterval) {
    var IMAGE_WAIT_INTERVAL = waitInterval || 100;

    function loadPath(path) {
      var image = new Image(),
        promise = loadImage(image);
      image.src = path;

      return promise;
    }

    function loadImage(image) {
      var promise = retro2d.promise(),
        intervalId = setInterval(function() {
          if(image.complete) {
            clearInterval(intervalId);
            promise.resolve(image);
          }
        }, IMAGE_WAIT_INTERVAL);

      return promise;
    }

    return {
      loadPath: loadPath,
      loadImage: loadImage
    };
  };
})();