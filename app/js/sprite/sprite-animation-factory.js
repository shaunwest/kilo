/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimationFactory', ['helper', 'spriteAnimation'], function(helper, spriteAnimation) {
  'use strict';

  return function(sprite) {
    return helper.clone(spriteAnimation).init(sprite);
  };
});
