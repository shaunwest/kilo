/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimationFactory', ['helper', 'spriteAnimation'], function(helper, spriteAnimation) {
  'use strict';

  var spriteAnimations = [];

  function get(sprite) {
    return (spriteAnimations.length > 0) ?
      spriteAnimations.shift().init(sprite) :
      helper.clone(spriteAnimation).init(sprite);
  }

  function free(spriteAnimation) {
    spriteAnimations.push(spriteAnimation);
  }

  return {
    get: get,
    free: free
  };
});
