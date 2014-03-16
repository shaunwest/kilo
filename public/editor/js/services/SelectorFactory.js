/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('selectorFactory', function() {
      return function(el) {
        return {
          el: el,
          x: 0,
          y: 0,
          setPosition: function(x, y) {
            this.x = x;
            this.y = y;
            this.el.css({left: x, top: y});
          }
        };
      };
    });
})();

