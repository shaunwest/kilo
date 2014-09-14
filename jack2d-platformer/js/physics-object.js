/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.PhysicsObject', ['helper', 'obj', 'chronoObject'], function(helper, obj, chronoObject) {
  'use strict';

  function calculateVelocity(deltaSeconds, velocity, acceleration, friction, maxVelocity) {
    if(Math.abs(velocity) < 1) {
      velocity = 0;
    }

    velocity += acceleration * deltaSeconds;
    velocity *= Math.pow(1 - friction, deltaSeconds);
    velocity = Math.min(velocity, maxVelocity);
    velocity = Math.max(velocity, -maxVelocity);

    return velocity;
  }

  return obj.mixin([chronoObject, {
    startPhysics: function() {
      this.velocityX = 0; // pixels/second
      this.velocityY = 0;
      this.frictionX = 0.0; // 0.0 (no friction) -> 1.0 (100% friction)
      this.frictionY = 0.0;
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.maxVelocityX = 500;
      this.maxVelocityY = 500;

      this.onFrame(function(deltaSeconds) {
        this.velocityX = calculateVelocity(deltaSeconds, this.velocityX,
          this.accelerationX, this.frictionX, this.maxVelocityX);
        this.velocityY = calculateVelocity(deltaSeconds, this.velocityY,
          this.accelerationY, this.frictionY, this.maxVelocityY);

        this.x += Math.round(this.velocityX * deltaSeconds);
        this.y += Math.round(this.velocityY * deltaSeconds);
      }, helper.getGID('physics'));
      return this;
    }
  }]);
});