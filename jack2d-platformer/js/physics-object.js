/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.PhysicsObject', ['helper', 'obj', 'chronoObject'], function(helper, obj, chronoObject) {
  'use strict';

  function calculateVelocityX(deltaSeconds,
                              velocityX,
                              accelerationX,
                              frictionX,
                              maxVelocityX) {
    if(Math.abs(velocityX) < 1) {
      velocityX = 0;
    }

    velocityX += accelerationX * deltaSeconds;
    velocityX *= Math.pow(1 - frictionX, deltaSeconds);
    velocityX = Math.min(velocityX, maxVelocityX);
    velocityX = Math.max(velocityX, -maxVelocityX);

    return velocityX;
  }

  function calculateVelocityY(deltaSeconds,
                              velocityY,
                              accelerationY,
                              frictionY,
                              maxVelocityY) {
    if(Math.abs(velocityY) < 1) {
      velocityY = 0;
    }

    velocityY += accelerationY * deltaSeconds;
    velocityY *= Math.pow(1 - frictionY, deltaSeconds);
    velocityY = Math.min(velocityY, maxVelocityY);
    velocityY = Math.max(velocityY, -maxVelocityY);

    return velocityY;
  }

  return obj.mixin([chronoObject, {
    init: function() {
      this.velocityX = 0; // pixels/second
      this.velocityY = 0;
      this.frictionX = 0.0; // 0.0 (no friction) -> 1.0 (100% friction)
      this.frictionY = 0.0;
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.maxVelocityX = 500;
      this.maxVelocityY = 500;

      this.onFrame(function(deltaSeconds) {
        this.velocityX = calculateVelocityX(deltaSeconds,  this.velocityX,
          this.accelerationX, this.frictionX, this.maxVelocityX);
        this.velocityY = calculateVelocityY(deltaSeconds, this.velocityY,
          this.accelerationY, this.frictionY, this.maxVelocityY);

        this.x += Math.round(this.velocityX * deltaSeconds);
        this.y += Math.round(this.velocityY * deltaSeconds);
      });

      return this;
    }
  }]);
});