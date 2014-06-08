/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['helper', 'platformer.physicsObject'], function(helper, physicsObject) {
  'use strict';

  return helper.augment(physicsObject, {
    init: function() {
      this.x = 0;
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.frictionX = 0.8;
      this.frictionY = 1;
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.onFrame(this.update);
      return this;
    },
    update: function(secondsElapsed) {
      this.physicsUpdate(secondsElapsed);
      this.x += this.velocityX * secondsElapsed;
      this.y += this.velocityY * secondsElapsed;
    }
  });
});
