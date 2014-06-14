/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimationFactory', ['helper', 'spriteAnimation'], function(helper, spriteAnimation) {
  'use strict';

  var spriteAnimations = [];

  function get(sprite) {
    return unCache(sprite) || helper.clone(spriteAnimation).initSprite(sprite);
  }

  function unCache(sprite) {
    if(spriteAnimations.length > 0) {
      return spriteAnimations.shift().initSprite(sprite);
    }
    return null;
  }

  function free(spriteAnimation) {
    spriteAnimations.push(spriteAnimation);
  }

  return {
    get: get,
    free: free
  };
});
