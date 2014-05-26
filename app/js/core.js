/**
 * Created by Shaun on 5/1/14.
 *
 * tx/ty = tile coordinates
 * x/y   = pixel (screen) coordinates
 *
 */


var jack2d = (function() {
  'use strict';

  var jack2d, helper, injector, config = {};

  helper = {
    isDefined: function(value) { return (typeof value !== 'undefined'); },
    isFunction: function(value) { return (typeof value === 'function'); },
    isArray: function(value) { return toString.call(value) === "[object Array]"; },
    def: function(value, defaultValue) { return (typeof value === 'undefined') ? defaultValue : value; },
    error: function(message) { throw new Error(message); },
    log: function(message) { console.log(message); },
    clone: function(object) {
      var newObject = {};
      for(var prop in object) {
        if(object.hasOwnProperty(prop)) {
          newObject[prop] = object[prop];
        }
      }
      return newObject;
    },
    augment: function(recieve, give) {
      for(var prop in give) {
        if(give.hasOwnProperty(prop) && !recieve.hasOwnProperty(prop)) {
          recieve[prop] = give[prop];
        }
      }
      return recieve;
    }
  };

  injector = {
    unresolved: {},
    modules: {},
    register: function(key, deps, func, scope) {
      this.unresolved[key] = {deps: deps, func: func, scope: scope};
    },
    setModule: function(key, module) { /** save a module without doing dependency resolution */
      this.modules[key] = module;
    },
    getDependency: function(key) {
      var module = this.modules[key];
      if(!module) {
        module = this.unresolved[key];
        if(module) {
          module = this.modules[key] = this.resolve(module.deps, module.func, module.scope);
          delete this.unresolved[key];
        }
      }
      return module;
    },
    resolve: function(deps, func, scope) {
      var dep, module, args = [], i;
      for(i = 0; i < deps.length; i++) {
        dep = deps[i];
        module = this.getDependency(dep);
        if(module) {
          args.push(module);
        } else {
          helper.error('Can\'t resolve ' + dep);
        }
      }
      return func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
  };

  /** add these basic modules to the injector */
  injector.setModule('helper', helper);
  injector.setModule('config', config);
  injector.setModule('injector', injector);

  jack2d = function(keyOrDeps, depsOrFunc, funcOrScope, scope) {
    /** get dependencies */
    if(helper.isArray(keyOrDeps)) {
      injector.resolve(keyOrDeps, depsOrFunc, funcOrScope);

    /** register a new module (with dependencies) */
    } else if(helper.isArray(depsOrFunc) && helper.isFunction(funcOrScope)) {
      injector.register(keyOrDeps, depsOrFunc, funcOrScope, scope);

    /** register a new module (without dependencies) */
    } else if(helper.isFunction(depsOrFunc)) {
      injector.register(keyOrDeps, [], depsOrFunc, funcOrScope);

    /** get a module */
    } else if(keyOrDeps) {
      return injector.getDependency(keyOrDeps);
    }

    return null;
  };

  /** a convenience function that combines jack2d DI with jquery 'ready' */
  jack2d.ready = function(deps, func, scope) {
    function go() { jack2d(deps, func, scope); }
    ($) ? $(document).ready(go) : go();
  };

  return jack2d;
})();

