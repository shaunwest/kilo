/**
 * Created by Shaun on 6/22/14.
 */

jack2d('collider', ['helper', 'obj', 'grid'], function(helper, obj, grid) {
  'use strict';

  var GRID_CELL_SIZE = 100;

  return obj.extend(grid, {
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

      return this;
    }
  });
});