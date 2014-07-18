/**
 * Created by Shaun on 7/8/14.
 */

jack2d('AABBObject', ['rect'], function(rect) {
  'use strict';

  return {
    moveX: function(deltaX) {
      this.moveDeltaX = deltaX;
    },
    moveY: function(deltaY) {
      this.moveDeltaY = deltaY;
    },
    alignLeft: function(x) {
      this.x = x - this.width;
    },
    alignRight: function(x) {
      this.x = x;
    },
    alignTop: function(y) {
      this.y = y - this.height;
    },
    alignBottom: function(y) {
      this.y = y;
    },
    computeAABB: function() {
      this.computeHorizontalBounds(this.moveDeltaX);
      this.computeVerticalBounds(this.moveDeltaY);
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
    collisionsDone: function() {
      this.x += this.moveDeltaX || 0;
      this.y += this.moveDeltaY || 0;
      this.moveDeltaX = 0;
      this.moveDeltaY = 0;

      if(this.collisionsDoneCallback) {
        this.collisionsDoneCallback();
      }
    },
    checkBorderCollisions: function(borders) {
      this.computeAABB();
      this.checkBorderCollisionsX(borders);
      this.checkBorderCollisionsY(borders);
      return this;
    },
    checkBorderCollisionsX: function(borders) {
      var diffX = rect.containsRectX(this.bounds, borders);
      if(diffX !== false) {
        this.moveDeltaX = 0;
        if(diffX < 0) {
          this.alignRight(0);
        } else if(diffX > 0) {
          this.alignLeft(borders.right);
        }
        if(this.borderXCollisionCallback) {
          this.borderXCollisionCallback(diffX);
        }
      }
      return this;
    },
    checkBorderCollisionsY: function(borders) {
      var diffY = rect.containsRectY(this.bounds, borders);
      if(diffY !== false) {
        this.moveDeltaY = 0;
        if(diffY < 0) {
          this.alignBottom(0);
        } else if(diffY > 0) {
          this.alignTop(borders.bottom);
        }
        if(this.borderYCollisionCallback) {
          this.borderYCollisionCallback(diffY);
        }
      }
      return this;
    },
    checkCollisionsX: function(targetObject) {
      var diffX, diffY;

      this.computeHorizontalBounds(this.moveDeltaX);
      this.computeVerticalBounds(0);
      diffX = rect.intersectsRectX(this.bounds, targetObject.bounds);
      diffY = rect.intersectsRectY(this.bounds, targetObject.bounds);

      if(diffX !== false && diffY !== false) {
        this.moveDeltaX = 0;
        if(diffX < 0) {
          this.alignLeft(targetObject.bounds.left);
        } else if(diffX > 0) {
          this.alignRight(targetObject.bounds.right);
        }
        if(this.objectXCollisionCallback) {
          this.objectXCollisionCallback(targetObject, diffX, diffY);
        }
      }

      return this;
    },
    checkCollisionsY: function(targetObject) {
      var diffX, diffY;

      this.computeHorizontalBounds(0);
      this.computeVerticalBounds(this.moveDeltaY);
      diffX = rect.intersectsRectX(this.bounds, targetObject.bounds);
      diffY = rect.intersectsRectY(this.bounds, targetObject.bounds);

      if(diffX !== false && diffY !== false) {
        this.moveDeltaY = 0;
        if(diffY < 0) {
          this.alignTop(targetObject.bounds.top);
        } else if(diffY > 0) {
          this.alignBottom(targetObject.bounds.bottom);
        }
        if(this.objectYCollisionCallback) {
          this.objectYCollisionCallback(targetObject, diffX, diffY);
        }
      }

      return this;
    },
    checkCollisions: function(targetObject) {
      if(!targetObject.computeAABB) {
        return this;
      }
      targetObject.computeAABB();

      if(this.moveDeltaX) {
        this.checkCollisionsX(targetObject);
      }
      if(this.moveDeltaY) {
        this.checkCollisionsY(targetObject);
      }

      return this;
    },
    onBorderXCollision: function(callback) {
      this.borderXCollisionCallback = callback;
      return this;
    },
    onBorderYCollision: function(callback) {
      this.borderYCollisionCallback = callback;
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
    }
  };
});