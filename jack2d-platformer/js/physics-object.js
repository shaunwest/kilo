/**
 * Created by Shaun on 6/7/14.
 */

jack2d('platformer.physicsObject', ['helper', 'chronoObject'], function(helper, chronoObject) {
  'use strict';

  return helper.augment(chronoObject, {
    physicsUpdate: function(secondsElapsed) {
      //this.velocityX *= (this.velocityX * Math.pow(this.dragX, secondsElapsed));
      if(this.velocityX < 1) {
        this.velocityX = 0;
      }
      this.velocityX += this.accelerationX * secondsElapsed;
      this.velocityX *= Math.pow(this.frictionX, secondsElapsed);
    }
    /*physicsUpdate: function(secondsElapsed) {
      this.velocityX += this.accelerationX - (this.dragX * this.velocityX);
      this.velocityY += this.accelerationY - (this.dragY * this.velocityY);
    }*/
    /*physicsUpdate: function(secondsElapsed) {
      //var mult = this.chrono.getTenthMultiplier();
      var dragForceX = (0.5 * Math.pow(this.velocityX, 2) * this.dragX);
      var dragForceY = (0.5 * Math.pow(this.velocityY, 2) * this.dragY);
      this.velocityX = (this.velocityX + (this.accelerationX)) - dragForceX;
      this.velocityY = (this.velocityY + (this.accelerationY)) - dragForceY;
    }*/
  });
});