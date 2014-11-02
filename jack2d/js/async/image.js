/**
 * Created by Shaun on 10/25/14.
 */

jack2d('Image', ['imageLoader'], function(ImageLoader) {
  'use strict';

  return function(path) {
    return ImageLoader.loadPath(path);
  };
});