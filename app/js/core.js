/**
 * Created by Shaun on 5/1/14.
 */

var jack2d = function() {};

(function() {
  'use strict';
  var helper = {};

  jack2d = function(keyOrDeps, depsOrFunc, funcOrScope, scope) {
    /** get dependencies */
    if(helper.isArray(keyOrDeps)) {
      jack2d.injector.resolve(keyOrDeps, depsOrFunc, funcOrScope);

    /** register a new module (with dependencies) */
    } else if(helper.isArray(depsOrFunc) && helper.isFunction(funcOrScope)) {
      jack2d.injector.register(keyOrDeps, depsOrFunc, funcOrScope, scope);

    /** register a new module (without dependencies) */
    } else if(helper.isFunction(depsOrFunc)) {
      jack2d.injector.register(keyOrDeps, [], depsOrFunc, funcOrScope);

    /** get a module */
    } else if(keyOrDeps) {
      return jack2d.injector.getDependency(keyOrDeps);
    }

    return null;
  };

  jack2d.ready = function(deps, func, scope) {
    function go() {
      jack2d(deps, func, scope);
    }
    if($) {
      $(document).ready(go);
    } else {
      go();
    }
  };

  jack2d.injector = {
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
      var dep, module, args = [];
      for(var i = 0; i < deps.length; i++) {
        dep = deps[i];
        module = this.getDependency(dep);
        if(module) {
          args.push(module);
        } else {
          throw new Error('Can\'t resolve ' + dep);
        }
      }
      return func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
  };

  helper.isDefined = function(value) { return (typeof value !== 'undefined'); };
  helper.isFunction = function(value) { return (typeof value === 'function'); };
  helper.isArray = function(value) { return toString.call(value) === "[object Array]"; };
  helper.def = function(value, defaultValue) { return (typeof value === 'undefined') ? defaultValue : value; };
  helper.error = function(message) { throw new Error(message); };
  helper.log = function(message) { console.log(message); };

  /** helper is basic; it doesn't have dependencies to resolve */
  jack2d.injector.setModule('helper', helper);
})();

