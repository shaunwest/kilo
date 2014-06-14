/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['helper', 'platformer.physicsObject'], function(helper, physicsObject) {
  'use strict';

  return helper.mixin(physicsObject, {
    initEntity: function() {
      this.x = 0;
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.frictionX = 0.5;
      this.frictionY = 0.5;
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.onFrame(function(deltaSeconds) {
        this.calculateVelocity(deltaSeconds);
        this.x += this.velocityX * deltaSeconds;
        this.y += this.velocityY * deltaSeconds;
      });
      return this;
    }
  });
});
