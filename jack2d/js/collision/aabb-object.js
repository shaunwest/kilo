/**
 * Created by Shaun on 7/8/14.
 */

jack2d('AABBObject', ['math'], function(math) {
  'use strict';

  return {
    onBoundaryCollision: function(callback) {
      this.boundaryCollisionCallback = callback;
      return this;
    },
    onObjectXCollision: function(callback) {
      this.objectXCollisionCallback = callback;
      return this;
    },
    onObjectYCollision: function(callback) {
      this.objectYCollisionCallback = callback;
      return this;
    },
    onCollisionsDone: function(callback) {
      this.collisionsDoneCallback = callback;
      return this;
    },
    moveX: function(deltaX) {
      this.moveDeltaX = deltaX;
    },
    moveY: function(deltaY) {
      this.moveDeltaY = deltaY;
    },
    resolveX: function(targetObj, diffX) {
      if(diffX < 0) {
        this.x = targetObj.x - this.width;
      } else if(diffX > 0) {
        this.x = targetObj.x + targetObj.width;
      }
      this.moveDeltaX = 0;
      return this;
    },
    resolveY: function(targetObj, diffY) {
      if(diffY < 0) {
        this.y = targetObj.y - this.height;
      } else if(diffY > 0) {
        this.y = targetObj.y + targetObj.height;
      }
      this.moveDeltaY = 0;
      return this;
    },
    computeAABB: function() {
      this.computeHorizontalBounds(this.moveDeltaX || 0);
      this.computeVerticalBounds(this.moveDeltaY || 0);
    },
    computeHorizontalBounds: function(deltaX) {
      var bounds = (this.bounds) ? this.bounds : this.bounds = {};

      bounds.left = this.x + deltaX;
      bounds.right = bounds.left + this.width;

      return bounds;
    },
    computeVerticalBounds: function(deltaY) {
      var bounds = (this.bounds) ? this.bounds : this.bounds = {};

      bounds.top = this.y + deltaY;
      bounds.bottom = bounds.top + this.height;

      return bounds;
    },
    intersectsVertical: function(r1, r2) {
      var intersects = !(r2.left >= r1.right || r2.right <= r1.left);
      return (intersects) ? r1.left - r2.left : false;
    },
    intersectsHorizontal: function(r1, r2) {
      var intersects = !(r2.top >= r1.bottom || r2.bottom <= r1.top);
      return (intersects) ? r1.top - r2.top : false;
    },
    collisionsDone: function() {
      this.x += this.moveDeltaX;
      this.y += this.moveDeltaY;
      this.moveDeltaX = 0;
      this.moveDeltaY = 0;

      if(this.collisionsDoneCallback) {
        this.collisionsDoneCallback();
      }
    },
    checkBoundsCollisions: function(boundaries) {
      if(this.boundaryCollisionCallback) {
        this.computeAABB();
        if(!math.containsRect(this.bounds, boundaries)) {
          console.log('Bounds Collision!!!');
          this.boundaryCollisionCallback();
        }
      }
      return this;
    },
    checkCollisions: function(targetObject) {
      var diffX, diffY;

      if(!targetObject.computeAABB) {
        return;
      }

      targetObject.computeAABB();

      if(this.moveDeltaX) {
        this.computeHorizontalBounds(this.moveDeltaX || 0);
        this.computeVerticalBounds(0);
        diffX = this.intersectsVertical(this.bounds, targetObject.bounds);
        diffY = this.intersectsHorizontal(this.bounds, targetObject.bounds);
        if(diffX !== false && diffY !== false) {
          this.resolveX(targetObject, diffX);
          if(this.objectXCollisionCallback) {
            this.objectXCollisionCallback(targetObject, diffX, diffY);
          }
        }
      }

      if(this.moveDeltaY) {
        this.computeHorizontalBounds(0);
        this.computeVerticalBounds(this.moveDeltaY || 0);
        diffX = this.intersectsVertical(this.bounds, targetObject.bounds);
        diffY = this.intersectsHorizontal(this.bounds, targetObject.bounds);
        if(diffX !== false && diffY !== false) {
          this.resolveY(targetObject, diffY);
          if(this.objectYCollisionCallback) {
            this.objectYCollisionCallback(targetObject, diffX, diffY);
          }
        }
      }
    }
  };
});