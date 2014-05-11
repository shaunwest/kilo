/**
 * Created by Shaun on 5/1/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.isDefined = function(value) {
    return (typeof value !== 'undefined');
  };

  retro2d.isFunction = function(value) {
    return (typeof value === 'function');
  };

  retro2d.def = function(value, defaultValue) {
    return (typeof value === 'undefined') ? defaultValue : value;
  };

  retro2d.error = function(message) {
    throw(message);
  };

  retro2d.log = function(message) {
    console.log(message);
  };

  retro2d.injector = {
    dependencies: {},
    register: function(key, value) {
      this.dependencies[key] = value;
    },
    resolve: function(deps, func, scope) {
      var args = [];
      for(var i = 0; i < deps.length; i++) {
        var dep = deps[i];
        if(this.dependencies[dep]) {
          args.push(this.dependencies[dep]);
        } else {
          throw new Error('Can\'t resolve ' + dep);
        }
      }
      return func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
  };
})();

retro2d.injector.register('retro2d', retro2d);