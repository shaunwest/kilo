/**
 * Created by Shaun on 5/24/14.
 */

jack2d('canvas', ['helper', 'doc', 'element', 'deferred'], function(helper, doc, element, deferred) {
  'use strict';

  var CHECKER_COLOR = 'rgba(184,184,184,0.5)'; // grey

  // think about wrapping entire object in deferred...
  // something like... var module = defer({myFunc1:..., myFunc2...});
  // could also call it proxy...
  return helper.mixin(element, deferred.deferAll({
    /*targetElement: function(elementOrSelector) {
      doc.getElement(elementOrSelector).then(helper.call(this, function(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        deferred.execute(this);
      }));
      return this;
    },*/
    click: function(callback) {
      this.element.addEventListener('click', callback, false);
      return this;
    },
    checkerBackground: function(size) {
      var canvas = this.element,
        width = canvas.width,
        height = canvas.height,
        widthInCheckers = width / size,
        heightInCheckers = height  / size,
        context = canvas.getContext('2d'),
        offset,
        i, j;

      context.fillStyle = CHECKER_COLOR;

      for(i = 0; i < widthInCheckers; i++) {
        offset = i % 2;
        for(j = 0; j < heightInCheckers; j++) {
          if(j % 2 === 0) {
            context.fillRect(i * size, (j + offset) * size, size, size);
          }
        }
      }
      return this;
    }
  }));
});