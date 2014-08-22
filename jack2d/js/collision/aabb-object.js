/**
 * Created by Shaun on 7/8/14.
 */

jack2d('AABBObject', ['helper', 'obj', 'rect', 'chronoObject'], function(helper, obj, rect, chronoObject) {
  'use strict';

  function resetCollisionVars(sourceObject) {
    sourceObject.collisionBottom = false;
    sourceObject.collisionLeft = false;
    sourceObject.collisionRight = false;
    sourceObject.collisionTop = false;
    sourceObject.objectCollision = false;
    sourceObject.borderCollision = false;
  }

  function computeMoveDelta(sourceObject) {
    sourceObject.moveDeltaX = sourceObject.x - (sourceObject.lastX || sourceObject.x);
    sourceObject.moveDeltaY = sourceObject.y - (sourceObject.lastY || sourceObject.y);
    sourceObject.x = sourceObject.lastX || sourceObject.x;
    sourceObject.y = sourceObject.lastY || sourceObject.y;
  }

  function computeHorizontalBounds(sourceObject, deltaX) {
    var moveDeltaX = helper.def(deltaX, 0),
      bounds = (sourceObject.bounds) ? sourceObject.bounds : sourceObject.bounds = {};

    bounds.left = sourceObject.x + moveDeltaX;
    bounds.right = bounds.left + sourceObject.width;

    return bounds;
  }

  function computeVerticalBounds(sourceObject, deltaY) {
    var moveDeltaY = helper.def(deltaY, 0),
      bounds = (sourceObject.bounds) ? sourceObject.bounds : sourceObject.bounds = {};

    bounds.top = sourceObject.y + moveDeltaY;
    bounds.bottom = bounds.top + sourceObject.height;

    return bounds;
  }

  function checkBorderCollisionsX(sourceObject, borders) {
    var diffX = rect.containsRectX(sourceObject.bounds, borders);
    if(diffX !== false) {
      sourceObject.moveDeltaX = 0;
      if(diffX < 0) {
        sourceObject.alignRight(0);
        sourceObject.collisionLeft = true;
        sourceObject.borderCollision = true;
      } else if(diffX > 0) {
        sourceObject.alignLeft(borders.right);
        sourceObject.borderCollision = true;
        sourceObject.collisionRight = true;
      }
    }
  }

  function checkBorderCollisionsY(sourceObject, borders) {
    var diffY = rect.containsRectY(sourceObject.bounds, borders);
    if(diffY !== false) {
      sourceObject.moveDeltaY = 0;
      if(diffY < 0) {
        sourceObject.alignBottom(0);
        sourceObject.borderCollision = true;
        sourceObject.collisionTop = true;
      } else if(diffY > 0) {
        sourceObject.alignTop(borders.bottom);
        sourceObject.borderCollision = true;
        sourceObject.collisionBottom = true;
      }
    }
  }

  function checkObjectCollisionsX(sourceObject, targetObject) {
    var diffX, diffY;

    computeHorizontalBounds(sourceObject, sourceObject.moveDeltaX);
    computeVerticalBounds(sourceObject, 0);
    diffX = rect.intersectsRectX(sourceObject.bounds, targetObject.bounds);
    diffY = rect.intersectsRectY(sourceObject.bounds, targetObject.bounds);

    if(diffX !== false && diffY !== false) {
      sourceObject.moveDeltaX = 0;
      if(diffX < 0) {
        sourceObject.alignLeft(targetObject.bounds.left);
        sourceObject.objectCollision = true;
        sourceObject.collisionRight = true;
      } else if(diffX > 0) {
        sourceObject.alignRight(targetObject.bounds.right);
        sourceObject.objectCollision = true;
        sourceObject.collisionLeft = true;
      }
    }
  }

  function checkObjectCollisionsY(sourceObject, targetObject) {
    var diffX, diffY;

    computeHorizontalBounds(sourceObject, 0);
    computeVerticalBounds(sourceObject, sourceObject.moveDeltaY);
    diffX = rect.intersectsRectX(sourceObject.bounds, targetObject.bounds);
    diffY = rect.intersectsRectY(sourceObject.bounds, targetObject.bounds);

    if(diffX !== false && diffY !== false) {
      sourceObject.moveDeltaY = 0;
      if(diffY < 0) {
        sourceObject.alignTop(targetObject.bounds.top);
        sourceObject.objectCollision = true;
        sourceObject.collisionBottom = true;
      } else if(diffY > 0) {
        sourceObject.alignBottom(targetObject.bounds.bottom);
        sourceObject.objectCollision = true;
        sourceObject.collisionTop = true;
      }
    }
  }

  function finalize(sourceObject) {
    sourceObject.x += sourceObject.moveDeltaX || 0;
    sourceObject.y += sourceObject.moveDeltaY || 0;
    sourceObject.lastX = sourceObject.x;
    sourceObject.lastY = sourceObject.y;
    sourceObject.moveDeltaX = 0;
    sourceObject.moveDeltaY = 0;

    if(sourceObject.collisionsDoneCallback) {
      sourceObject.collisionsDoneCallback();
    }
  }

  return obj.mixin([chronoObject, {
    collisions: function(collider, callback) {
      if(!helper.isDefined(collider)) {
        helper.error('Jack2d: AABBObject: collider is not defined.');
      }
      collider.addObject(this);
      this.collider = collider;
      this.onFrame(function() {
        this.checkCollisions();
        if(callback) {
          callback.call(this);
        }
      }, 'aabb-object');
      return this;
    },
    checkCollisions: function() {
      var collider = this.collider;

      resetCollisionVars(this);
      computeMoveDelta(this);

      this.checkBorderCollisions(collider.collisionBounds);
      this.checkObjectCollisions(collider.getNearby(this));

      finalize(this);
      return this;
    },
    computeAABB: function() {
      computeHorizontalBounds(this, this.moveDeltaX);
      computeVerticalBounds(this, this.moveDeltaY);
    },

    checkBorderCollisions: function(borders) {
      this.computeAABB();
      checkBorderCollisionsX(this, borders);
      checkBorderCollisionsY(this, borders);
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
        checkObjectCollisionsX(this, targetObject);
      }
      if(this.moveDeltaY) {
        checkObjectCollisionsY(this, targetObject);
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
    onCollisionsDone: function(callback) {
      this.collisionsDoneCallback = callback;
      return this;
    }
  }]);
});