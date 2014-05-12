/**
 * Created by Shaun on 5/1/14.
 */

jack2d('imageLoader', ['promiser'], function(promiser) {
  'use strict';

  var IMAGE_WAIT_INTERVAL = 100;

  function loadPath(path) {
    var image = new Image(),
      promise = loadImage(image);
    image.src = path;

    return promise;
  }

  function loadImage(image) {
    var promise = promiser.get(),
      intervalId = setInterval(function() {
        if(image.complete) {
          clearInterval(intervalId);
          promiser.resolve(promise, image);
        }
      }, IMAGE_WAIT_INTERVAL);

    return promise;
  }

  return {
    loadPath: loadPath,
    loadImage: loadImage
  };
});