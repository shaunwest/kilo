/**
 * Created by Shaun on 5/1/14.
 */

jack2d('imageLoader', [], function() {
  'use strict';

  var IMAGE_WAIT_INTERVAL = 100;

  function loadPath(path) {
    var image = new Image(),
      promise = loadImage(image);
    image.src = path;

    return promise;
  }

  function loadImage(image) {
    return new Promise(function(resolve, reject) {
      var intervalId = setInterval(
        function() {
          if(image.complete) {
            clearInterval(intervalId);
            resolve(image);
          }
        }, IMAGE_WAIT_INTERVAL);

      image.onerror = function() {
        clearInterval(intervalId);
        reject();
      };
    });
  }

  return {
    loadPath: loadPath,
    loadImage: loadImage
  };
});