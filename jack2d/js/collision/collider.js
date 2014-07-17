/**
 * Created by Shaun on 6/22/14.
 */

jack2d('collider', ['helper', 'obj', 'grid'], function(helper, obj, grid) {
  'use strict';

  var GRID_CELL_SIZE = 100;

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
      return addObject.call(this, colliderObject);
    },
    checkCollisions: function() {
      var gridObjects = this.gridObjects,
        numGridObjects = gridObjects.length,
        gridObject, i;

      for(i = 0; i < numGridObjects; i++) {
        gridObject = gridObjects[i];

        if(gridObject.checkBoundsCollisions) {
          gridObject.checkBoundsCollisions(this.collisionBounds);
        }

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
        targetObject, i;

      for(i = 0; i < numTargetObjects; i++) {
        targetObject = targetObjects[i];
        sourceObject.checkCollisions(targetObject);
      }
      return this;
    }/*,
    checkBoundsCollisions: function(sourceObject) {
      if(sourceObject.boundaryCollisionCallback) {
        computeBounds(sourceObject);
        if(!containsRect(sourceObject.bounds, this.collisionBounds)) {
          sourceObject.boundaryCollisionCallback();
        }
      }
      return this;
    }*/
  });
});