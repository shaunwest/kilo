/**
 * Created by Shaun on 7/8/14.
 */

jack2d('AABBObject', ['helper', 'obj', 'rect', 'chronoObject'], function(helper, obj, rect, chronoObject) {
  'use strict';

  return obj.mixin([chronoObject, {
    collisions: function(collider) {
      if(!helper.isDefined(collider)) {
        helper.error('Jack2d: AABBObject: collider is not defined.');
      }
      collider.addObject(this);
      this.collider = collider;
      this.onFrame(this.checkCollisions);
      return this;
    },
    checkCollisions: function() {
      var collider = this.collider;

      if(this.computeMoveDelta) {
        this.computeMoveDelta();

        if(this.checkBorderCollisions) {
          this.checkBorderCollisions(collider.collisionBounds);
        }

        if(this.checkObjectCollisions) {
          this.checkObjectCollisions(collider.getNearby(this));

          if(this.collisionsDone) {
            this.collisionsDone();
          }
        }
      }
      return this;
    },
    computeMoveDelta: function() {
      this.moveDeltaX = this.x - (this.lastX || this.x);
      this.moveDeltaY = this.y - (this.lastY || this.y);
      this.x = this.lastX || this.x;
      this.y = this.lastY || this.y;
    },
    computeAABB: function() {
      this.computeHorizontalBounds(this.moveDeltaX);
      this.computeVerticalBounds(this.moveDeltaY);
    },
    computeHorizontalBounds: function(deltaX) {
      var moveDeltaX = helper.def(deltaX, 0),
        bounds = (this.bounds) ? this.bounds : this.bounds = {};

      bounds.left = this.x + moveDeltaX;
      bounds.right = bounds.left + this.width;

      return bounds;
    },
    computeVerticalBounds: function(deltaY) {
      var moveDeltaY = helper.def(deltaY, 0),
        bounds = (this.bounds) ? this.bounds : this.bounds = {};

      bounds.top = this.y + moveDeltaY;
      bounds.bottom = bounds.top + this.height;

      return bounds;
    },
    collisionsDone: function() {
      this.x += this.moveDeltaX || 0;
      this.y += this.moveDeltaY || 0;
      this.lastX = this.x;
      this.lastY = this.y;
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
    checkObjectCollisions: function(targetObjects) {
      var numTargetObjects = targetObjects.length,
        targetObject, i;

      for(i = 0; i < numTargetObjects; i++) {
        targetObject = targetObjects[i];
        this.checkObjectCollision(targetObject);
      }
      return this;
    },
    checkObjectCollision: function(targetObject) {
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
    alignLeft: function(x) {
      this.x = this.lastX = x - this.width;
    },
    alignRight: function(x) {
      this.x = this.lastX = x;
    },
    alignTop: function(y) {
      this.y = this.lastY = y - this.height;
    },
    alignBottom: function(y) {
      this.y = this.lastY = y;
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
  }]);
});