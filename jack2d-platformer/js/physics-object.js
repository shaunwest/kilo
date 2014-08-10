/**
 * Created by Shaun on 8/6/14.
 */

jack2d('platformer.PhysicsObject', ['obj'], function(Obj) {
  'use strict';

  return Obj.mixin(['platformer.BasePhysicsObject', {
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
  }]);
});
