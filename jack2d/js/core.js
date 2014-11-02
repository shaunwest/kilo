/**
 * Created by Shaun on 5/1/14.
 *
 * tx/ty = tile coordinates
 * x/y   = pixel (screen) coordinates
 *
 */

var jack2d = (function() {
  'use strict';

  var jack2d, helper, injector, appConfig = {}, gids = {};

  helper = {
    isDefined: function(value) { return (typeof value !== 'undefined'); },
    isObject: function(value) { return (value !== null && typeof value === 'object'); },
    isBoolean: function(value) { return (typeof value === 'boolean'); },
    def: function(value, defaultValue) { return (typeof value === 'undefined') ? defaultValue : value; },
    error: function(message) { throw new Error(message); },
    warn: function(message) { console.error(message); },
    info: function(message) { console.log(message); },
    log: function(message) { if(jack2d.log) { console.log(message); } },
    argsToArray: function(args) { return Array.prototype.slice.call(args); },
    getGID: function(group) {
      if(!group) {
        group = '';
      }
      if(!gids[group]) {
        gids[group] = 0;
      }
      return group + (++gids[group]);
    },
    rand: function(max) {
      return Math.floor((Math.random() * (max + 1)));
    },
    call: function(context, func) { // TODO: move to Func
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        func.apply(context, (args.length > 0) ? args : arguments);
      };
    }
  };

  ['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'HTMLImageElement'].
    forEach(function(name) {
      helper['is' + name] = function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']';
      };
    });

  injector = {
    unresolved: {},
    modules: {},
    register: function(key, deps, func, scope) {
      this.unresolved[key] = {deps: deps, func: func, scope: scope};
    },
    setModule: function(key, module) { // save a module without doing dependency resolution
      this.modules[key] = module;
    },
    getDependency: function(key) {
      var module = this.modules[key];
      if(!module) {
        module = this.unresolved[key];
        if(module) {
          helper.info('Jack2d: resolving dependencies for \'' + key + '\'');
          module = this.modules[key] = this.resolve(module.deps, module.func, module.scope);
          if(helper.isObject(module)) {
            module.getType = function() { return key; };
          }
          delete this.unresolved[key];
        } else {
          helper.warn('Jack2d: module \'' + key + '\' not found');
        }
      }
      return module;
    },
    resolve: function(deps, func, scope) {
      var dep, depName, args = [], i;
      for(i = 0; i < deps.length; i++) {
        depName = deps[i];
        dep = this.getDependency(depName);
        if(dep) {
          args.push(dep);
        } else {
          helper.warn('Jack2d: Can\'t resolve ' + depName);
        }
      }
      return func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
  };

  /** add these basic modules to the injector */
  injector.setModule('helper', helper);
  injector.setModule('appConfig', appConfig);
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
    } else if(keyOrDeps && !helper.isDefined(depsOrFunc)) {
      return injector.getDependency(keyOrDeps);
    }

    return null;
  };

  jack2d.log = true;

  return jack2d;
})();

