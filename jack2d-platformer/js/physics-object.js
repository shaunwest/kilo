/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.physicsObject', ['helper', 'obj', 'chronoObject'], function(helper, obj, chronoObject) {
  'use strict';

  return obj.mixin(chronoObject, {
    physics: function(ready) {
      this.x = 0;
      this.y = 0;
      this.velocityX = 0; // pixels/second
      this.velocityY = 0;
      this.frictionX = 0.005; //0 (100% friction) -> 1 (no friction)
      this.frictionY = 0.5;
      this.accelerationX = 0;
      this.accelerationY = 0;
      this.onFrame(function(deltaSeconds) {
        this.calculateVelocity(deltaSeconds);
        this.x += Math.round(this.velocityX * deltaSeconds);
        this.y += Math.round(this.velocityY * deltaSeconds);
      });
      if(helper.isFunction(ready)) {
        helper.call(this, ready, this)();
      }
      return this;
    },
    calculateVelocity: function(deltaSeconds) {
      if(Math.abs(this.velocityX) < 1) {
        this.velocityX = 0;
      }
      if(Math.abs(this.velocityY) < 1) {
        this.velocityY = 0;
      }
      this.velocityX += this.accelerationX * deltaSeconds;
      this.velocityX *= Math.pow(this.frictionX / 100, deltaSeconds);

      this.velocityY += this.accelerationY * deltaSeconds;
      this.velocityY *= Math.pow(this.frictionY / 100, deltaSeconds);
    },
    setVelocityX: function(value) {
      this.velocityX = value;
      return this;
    },
    setVelocityY: function(value) {
      this.velocityY = value;
      return this;
    }
  });
});