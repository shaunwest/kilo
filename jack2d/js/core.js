/**
 * Created by Shaun on 5/1/14.
 *
 * tx/ty = tile coordinates
 * x/y   = pixel (screen) coordinates
 *
 */

var jack2d = (function() {
  'use strict';

  var jack2d, helper, injector, appConfig = {};

  helper = {
    isDefined: function(value) { return (typeof value !== 'undefined'); },
    isObject: function(value) { return (value !== null && typeof value === 'object'); },
    def: function(value, defaultValue) { return (typeof value === 'undefined') ? defaultValue : value; },
    error: function(message) { throw new Error(message); },
    call: function(context, func) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function() {
        func.apply(context, (args.length > 0) ? args : arguments);
      };
    },
    clone: function(object) {
      var newObject = {};
      for(var prop in object) {
        if(object.hasOwnProperty(prop)) {
          newObject[prop] = object[prop];
        }
      }
      return newObject;
    },
    create: function(source) {
      return this.mixin(source);
    },
    printObject: function(obj) {
      var prop, str = '';
      for(prop in obj) {
        if(obj.hasOwnProperty(prop) && !helper.isFunction(obj[prop])) {
         str += prop + ': ' + obj[prop] + '<br>';
        }
      }
      return str;
    },
    mixin: function(giver, reciever, exceptionOnCollisions) {
      reciever = reciever || {};
      if(helper.isArray(giver)) {
        giver.forEach(function(obj) {
          if(helper.isString(obj)) {
            obj = injector.getDependency(obj);
          }
          mergeObjects(obj, reciever);
        });
      } else {
        if(helper.isString(giver)) {
          giver = injector.getDependency(giver);
        }
        mergeObjects(giver, reciever);
      }

      function mergeObjects(giver, reciever) {
        giver = giver || {};
        if(giver.__mixin === false) {
          console.log('Jack2d: Can\'t mixin object because it\'s disallowed.');
          return;
        }
        Object.keys(giver).forEach(function(prop) {
          if(!helper.isFunction(giver[prop])) {
            // we don't want to merge state, so
            // only allow functions.
            return;
          } else if(reciever.hasOwnProperty(prop)) {
            if(exceptionOnCollisions) {
              helper.error('Jack2d: Failed to merge mixin. Method \'' +
                prop + '\' caused a name collision.');
            } else {
              console.log('Jack2d: Merged \'' + prop + '\'');
            }
          }
          reciever[prop] = giver[prop];
        });
      }
      return reciever;
    }
  };

  ['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].
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

  jack2d.mixin = helper.mixin;
  jack2d.create = helper.create;

  return jack2d;
})();

