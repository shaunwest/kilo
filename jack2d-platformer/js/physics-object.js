/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.physicsObject', ['helper', 'chronoObject'], function(helper, chronoObject) {
  'use strict';

  return helper.mixin(chronoObject, {
    calculateVelocity: function(deltaSeconds) {
      if(Math.abs(this.velocityX) < 1) {
        this.velocityX = 0;
      }
      if(Math.abs(this.velocityY) < 1) {
        this.velocityY = 0;
      }
      this.velocityX += this.accelerationX * deltaSeconds;
      this.velocityX *= Math.pow(this.frictionX, deltaSeconds);

      this.velocityY += this.accelerationY * deltaSeconds;
      this.velocityY *= Math.pow(this.frictionY, deltaSeconds);
    }
  });
});