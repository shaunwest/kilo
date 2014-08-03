/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.physicsObject', ['helper', 'obj', 'chronoObject'], function(helper, obj, chronoObject) {
  'use strict';

  return obj.mixin(chronoObject, {
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
        this.calculateVelocity(deltaSeconds);
        this.x += Math.round(this.velocityX * deltaSeconds);
        this.y += Math.round(this.velocityY * deltaSeconds);
      });

      return this;
    },
    calculateVelocity: function(deltaSeconds) {
      this.calculateVelocityX(deltaSeconds);
      this.calculateVelocityY(deltaSeconds);
    },
    calculateVelocityX: function(deltaSeconds) {
      var velocityX = this.velocityX;

      if(Math.abs(velocityX) < 1) {
        velocityX = 0;
      }

      velocityX += this.accelerationX * deltaSeconds;
      velocityX *= Math.pow(1 - this.frictionX, deltaSeconds);
      velocityX = Math.min(velocityX, this.maxVelocityX);
      velocityX = Math.max(velocityX, -this.maxVelocityX);

      this.velocityX = velocityX;
    },
    calculateVelocityY: function(deltaSeconds) {
      var velocityY = this.velocityY;

      if(Math.abs(velocityY) < 1) {
        velocityY = 0;
      }

      velocityY += this.accelerationY * deltaSeconds;
      velocityY *= Math.pow(1 - this.frictionY, deltaSeconds);
      velocityY = Math.min(velocityY, this.maxVelocityY);
      velocityY = Math.max(velocityY, -this.maxVelocityY);

      this.velocityY = velocityY;
    },
    setVelocityX: function(value) {
      this.velocityX = value;
      return this;
    },
    setVelocityY: function(value) {
      this.velocityY = value;
      return this;
    },
    setFrictionX: function(value) {
      this.frictionX = value;
      return this;
    },
    setFrictionY: function(value) {
      this.frictionY = value;
      return this;
    },
    setAccelerationX: function(value) {
      this.accelerationX = value;
      return this;
    },
    setAccelerationY: function(value) {
      this.accelerationY = value;
      return this;
    },
    setMaxVelocityY: function(value) {
      this.maxVelocityY = value;
      return this;
    },
    setMaxVelocityX: function(value) {
      this.maxVelocityX = value;
      return this;
    }
  });
});