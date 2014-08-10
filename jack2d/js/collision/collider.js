/**
 * Created by Shaun on 6/22/14.
 */

jack2d('collider', ['helper', 'obj', 'grid'], function(helper, obj, grid) {
  'use strict';

  var GRID_CELL_SIZE = 100;

  return obj.extend([grid, {
    setWorldBounds: function(width, height, cellSize) { // TODO: see about extending 'setGrid' instead
      height = height || width;
      cellSize = cellSize || GRID_CELL_SIZE;

      this.setGrid(cellSize,
        Math.ceil(width / cellSize),
        Math.ceil(height / cellSize));

      this.collisionBounds = {
        left: 0,
        top: 0,
        right: width,
        bottom: height
      };

      return this;
    }
  }]);
});