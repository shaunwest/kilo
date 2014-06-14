/**
 *
 * Created by Shaun on 6/8/14.
 */

jack2d('keysDemo', ['inputFactory'], function(inputFactory) {
  'use strict';

  var KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    input = inputFactory({
      left: {key: KEY_LEFT},
      right: {key: KEY_RIGHT},
      up: {key: KEY_UP},
      down: {key: KEY_DOWN}
    });

  return input;
});