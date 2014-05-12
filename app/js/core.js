/**
 * Created by Shaun on 5/1/14.
 */

var jack2d = function() {};

(function() {
  'use strict';
  var helper = {};

  jack2d = function(keyOrDeps, depsOrFunc, funcOrScope, scope) {
    //var module;
    //
    /*function resolveAndRegister(moduleDef) {
      var module = jack2d.injector.resolve(moduleDef.deps, moduleDef.func, moduleDef.scope);
      jack2d.injector.register(moduleDef.key, module);
      jack2d[moduleDef.key] = module;
      return module;
    }*/

    // getting dependencies
    if(helper.isArray(keyOrDeps)) {
      jack2d.injector.resolve(keyOrDeps, depsOrFunc, funcOrScope);

    // registering a new module
    } else if(helper.isArray(depsOrFunc) && helper.isFunction(funcOrScope)) {
      jack2d.injector.register(keyOrDeps, depsOrFunc, funcOrScope, scope);
      //unresolved[keyOrDeps] = {key: keyOrDeps, deps: depsOrFunc, func: funcOrScope, scope: scope};
      /*module = jack2d.injector.resolve(depsOrFunc, funcOrScope, scope);
      jack2d.injector.register(keyOrDeps, module);
      jack2d[keyOrDeps] = module;    // getting a module*/
    } else if(keyOrDeps) {
      //module = jack2d.injector.getDependency(keyOrDeps);
      var module = jack2d.injector.getDependency(keyOrDeps);
      jack2d[keyOrDeps] = module;
      return module;
    }
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
      //this.dependencies[key] = value;
      this.unresolved[key] = {deps: deps, func: func, scope: scope};
    },
    setModule: function(key, module) {
      this.modules[key] = module;
    },
    getModule: function(key) {
      return this.modules[key];
    },
    getUnresolved: function(key) {
      return this.unresolved[key];
    },
    getDependency: function(key) {
      var module = this.getModule(key);
      if(!module) {
        module = this.getUnresolved(key);
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

  helper.isDefined = function(value) {
    return (typeof value !== 'undefined');
  };

  helper.isFunction = function(value) {
    return (typeof value === 'function');
  };

  helper.isArray = function(value) {
    return toString.call(value) === "[object Array]";
  };

  helper.def = function(value, defaultValue) {
    return (typeof value === 'undefined') ? defaultValue : value;
  };

  helper.error = function(message) {
    throw new Error(message);
  };

  helper.log = function(message) {
    console.log(message);
  };

  //jack2d.injector.register('jack2d', jack2d);
  jack2d.injector.setModule('helper', helper);
})();

