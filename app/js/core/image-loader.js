/**
 * Created by Shaun on 5/1/14.
 */

jack2d.imageLoader = jack2d.injector.resolve(['jack2d'], function(jack2d) {
  'use strict';

  var IMAGE_WAIT_INTERVAL = 100;

  function loadPath(path) {
    var image = new Image(),
      promise = loadImage(image);
    image.src = path;

    return promise;
  }

  function loadImage(image) {
    var promise = jack2d.promiser.get(),
      intervalId = setInterval(function() {
        if(image.complete) {
          clearInterval(intervalId);
          jack2d.promiser.resolve(promise, image);
        }
      }, IMAGE_WAIT_INTERVAL);

    return promise;
  }

  return {
    loadPath: loadPath,
    loadImage: loadImage
  };
});