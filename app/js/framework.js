/**
 * Created by Shaun on 5/1/14.
 */

var jack2d = function() {};

(function() {
  'use strict';

  jack2d = function(key, deps, func, scope) {
    var module = jack2d.injector.resolve(deps, func, scope);
    jack2d.injector.register(key, module);
    jack2d[key] = module;
    return module;
  };

  jack2d.isDefined = function(value) {
    return (typeof value !== 'undefined');
  };

  jack2d.isFunction = function(value) {
    return (typeof value === 'function');
  };

  jack2d.def = function(value, defaultValue) {
    return (typeof value === 'undefined') ? defaultValue : value;
  };

  jack2d.error = function(message) {
    throw new Error(message);
  };

  jack2d.log = function(message) {
    console.log(message);
  };

  jack2d.injector = {
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

  jack2d.injector.register('jack2d', jack2d);
})();

