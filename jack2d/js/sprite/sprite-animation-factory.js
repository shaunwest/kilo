/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimationFactory', ['helper', 'spriteAnimation'], function(helper, spriteAnimation) {
  'use strict';

  var spriteAnimations = [];

  function get(spriteSheetPath) {
    return (unCache() || helper.clone(spriteAnimation)).loadSpriteSheet(spriteSheetPath);
  }

  function unCache() {
    if(spriteAnimations.length > 0) {
      return spriteAnimations.shift();
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
