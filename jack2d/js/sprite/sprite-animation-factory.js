/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimationFactory', ['obj', 'spriteAnimation'], function(obj, spriteAnimation) {
  'use strict';

  var spriteAnimations = [];

  function get(spriteSheetPath) {
    return (unCache() || obj.clone(spriteAnimation)).loadSpriteSheet(spriteSheetPath);
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
