/**
 * Created by Shaun on 6/14/14.
 */

jack2d('spriteDemo', ['spriteFactory'], function(spriteFactory, spriteAnimationFactory) {
  'use strict';
  return spriteFactory('img/player48.png').
    spriteSheetReady(function(sprite) {
      /** play an animation sequence */
      var spriteAnimation = spriteAnimationFactory.get(sprite);
      spriteAnimation.playSequence(2, true).frameDone(function() {
        animationContext.clearRect(0, 0, 48, 48);
        animationContext.drawImage(spriteAnimation.getCurrentFrame(), 0, 0);
      });
    });
});