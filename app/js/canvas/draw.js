/**
 * Created by Shaun on 5/24/14.
 */

jack2d('canvas.draw', function() {
  'use strict';

  var CHECKER_COLOR = 'rgba(184,184,184,0.5)'; // grey

  function checkerBackground(canvas, size) {
    var width = canvas.width,
      sizeInCheckers = width / size,
      context = canvas.getContext('2d'),
      offset,
      i, j;

    context.fillStyle = CHECKER_COLOR;

    for(i = 0; i < sizeInCheckers; i++) {
      offset = i % 2;
      for(j = 0; j < sizeInCheckers; j++) {
        if(j % 2 === 0) {
          context.fillRect(i * size, (j + offset) * size, size, size);
        }
      }
    }
  }

  return {
    checkerBackground: checkerBackground
  };
});