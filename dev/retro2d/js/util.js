/**
 * Created by Shaun on 5/1/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.isDefined = function(value) {
    return (typeof value !== 'undefined');
  };

  retro2d.def = function(value, defaultValue) {
    return (typeof value === 'undefined') ? defaultValue : value;
  };

  retro2d.error = function(message) {
    throw(message);
  };
})();