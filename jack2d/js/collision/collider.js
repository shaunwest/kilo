/**
 * Created by Shaun on 6/22/14.
 */

jack2d('collider', ['helper', 'obj', 'grid'], function(helper, obj, grid) {
  'use strict';

  var GRID_CELL_SIZE = 100;

  /*function intersectsVertical(r1, r2) {
    var intersects = !(r2.left >= r1.right || r2.right <= r1.left);
    return (intersects) ? r1.left - r2.left : false;
  }

  function intersectsHorizontal(r1, r2) {
    var intersects = !(r2.top >= r1.bottom || r2.bottom <= r1.top);
    return (intersects) ? r1.top - r2.top : false;
  }

  function intersectRect(r1, r2) {
    return !(r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
  }

  function containsRect(inner, outer) {
    return !(inner.left < outer.left ||
      inner.right > outer.right ||
      inner.top < outer.top ||
      inner.bottom > outer.bottom);
  }

  function computeBounds(colliderObject) {
    computeHorizontalBounds(colliderObject, colliderObject.moveDeltaX);
    computeVerticalBounds(colliderObject, colliderObject.moveDeltaY);
  }

  function computeHorizontalBounds(colliderObject, deltaX) {
    var bounds = (colliderObject.bounds) ? colliderObject.bounds : colliderObject.bounds = {};
    bounds.left = colliderObject.x + deltaX;
    bounds.right = bounds.left + colliderObject.width;
    return bounds;
  }

  function computeVerticalBounds(colliderObject, deltaY) {
    var bounds = (colliderObject.bounds) ? colliderObject.bounds : colliderObject.bounds = {};
    bounds.top = colliderObject.y + deltaY;
    bounds.bottom = bounds.top + colliderObject.height;
    return bounds;
  }*/

  return obj.mixin(grid, {
    setWorldBounds: function(width, height) {
      height = height || width;
      this.setGrid(GRID_CELL_SIZE,
        Math.ceil(width / GRID_CELL_SIZE),
        Math.ceil(height / GRID_CELL_SIZE));
      this.collisionBounds = {
        left: 0,
        top: 0,
        right: width,
        bottom: height
      };
      this.onFrame(this.checkCollisions);
      return this;
    },
    addObject: function(addObject, colliderObject) {
      //colliderObject.moveDeltaX = 0;
      //colliderObject.moveDeltaY = 0;
      return addObject.call(this, colliderObject);
    },
    checkCollisions: function() {
      var gridObjects = this.gridObjects,
        numGridObjects = gridObjects.length,
        gridObject, i;

      for(i = 0; i < numGridObjects; i++) {
        gridObject = gridObjects[i];

        //this.checkBoundsCollisions(gridObject);
        if(gridObject.checkCollisions) {
          this.checkObjectCollisions(gridObject, this.getNearby(gridObject));

          if(gridObject.collisionsDone) {
            gridObject.collisionsDone();
          }
        }
      }

      return this;
    },
    checkObjectCollisions: function(sourceObject, targetObjects) {
      var numTargetObjects = targetObjects.length,
        diffX, diffY,
        targetObject, i;

      for(i = 0; i < numTargetObjects; i++) {
        targetObject = targetObjects[i];
        sourceObject.checkCollisions(targetObject);
        /*computeBounds(targetObject);

        if(sourceObject.moveDeltaX && sourceObject.objectXCollisionCallback) {
          computeHorizontalBounds(sourceObject, sourceObject.moveDeltaX);
          computeVerticalBounds(sourceObject, 0);
          diffX = intersectsVertical(sourceObject.bounds, targetObject.bounds);
          diffY = intersectsHorizontal(sourceObject.bounds, targetObject.bounds);
          if(diffX !== false && diffY !== false) {
            sourceObject.objectXCollisionCallback(targetObject, diffX, diffY);
          }
        }

        if(sourceObject.moveDeltaY && sourceObject.objectYCollisionCallback) {
          computeHorizontalBounds(sourceObject, 0);
          computeVerticalBounds(sourceObject, sourceObject.moveDeltaY);
          diffX = intersectsVertical(sourceObject.bounds, targetObject.bounds);
          diffY = intersectsHorizontal(sourceObject.bounds, targetObject.bounds);
          if(diffX !== false && diffY !== false) {
            sourceObject.objectYCollisionCallback(targetObject, diffX, diffY);
          }
        }*/
      }
      return this;
    },
    checkBoundsCollisions: function(sourceObject) {
      if(sourceObject.boundaryCollisionCallback) {
        computeBounds(sourceObject);
        if(!containsRect(sourceObject.bounds, this.collisionBounds)) {
          sourceObject.boundaryCollisionCallback();
        }
      }
      return this;
    }
  });
});