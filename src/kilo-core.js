/**
 * Created by Shaun on 5/1/14.
 */

(function(id) {
  'use strict';

  var core, Util, Injector, types, appConfig = {}, gids = {}, allElements, previousOwner = undefined;
  var CONSOLE_ID = id;

  Util = {
    isDefined: function(value) { return (typeof value !== 'undefined'); },
    isBoolean: function(value) { return (typeof value === 'boolean'); },
    def: function(value, defaultValue) { return (typeof value === 'undefined') ? defaultValue : value; },
    error: function(message) { throw new Error(CONSOLE_ID + ': ' + message); },
    warn: function(message) { Util.log('Warning: ' + message); },
    log: function(message) { if(core.log) { console.log(CONSOLE_ID + ': ' + message); } },
    argsToArray: function(args) { return Array.prototype.slice.call(args); },
    getGID: function(prefix) {
      prefix = Util.def(prefix, '');
      gids[prefix] = Util.def(gids[prefix], 0);
      return prefix + (++gids[prefix]);
    },
    rand: function(max, min) {
      min = min || 0;
      if(min > max || max < min) { Util.error('rand: invalid range.'); }
      return Math.floor((Math.random() * (max - min + 1))) + (min);
    }
  };

  types = ['Array', 'Object', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'HTMLImageElement'];
  for(var i = 0; i < types.length; i++) {
    Util['is' + types[i]] = (function(type) { 
      return function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
      }; 
    })(types[i]);
  }

  Injector = {
    unresolved: {},
    modules: {},
    register: function(key, deps, func, scope) {
      this.unresolve(key);
      this.unresolved[key] = {deps: deps, func: func, scope: scope};
      return this;
    },
    unresolve: function(key) {
      if(this.modules[key]) {
        delete this.modules[key];
      }
      return this;
    },
    setModule: function(key, module) { // save a module without doing dependency resolution
      this.modules[key] = module;
      return this;
    },
    getDependency: function(key, cb) {
      var modules, module;

      modules = this.modules;
      module = modules[key];

      if(module) {
        cb(module);
        return;
      }

      module = this.unresolved[key];
      if(!module) {
        getElement(key, null, function(element) {
          if(element) {
            cb(element);
          } else {
            Util.warn('Module \'' + key + '\' not found');
          }
        });
        return;
      }

      Util.log('Resolving dependencies for \'' + key + '\'');
      this.resolveAndApply(module.deps, module.func, module.scope, function(module) {
        if(Util.isObject(module)) {
          module.getType = function() { return key; };
        }
        modules[key] = module;
        cb(module);
      });

      return;
    },
    resolve: function(deps, cb, index, results) {
      var dep, depName;
      var that = this; // FIXME

      if(!deps) {
        done();
        return;
      }

      index = Util.def(index, 0);

      depName = deps[index];
      if(!depName) {
        cb(results);
        return;
      }
      
      this.getDependency(depName, function(dep) {
        if(!results) {
          results = [];
        }
        if(dep) {
          results.push(dep);
        } else {
          Util.error('Can\'t resolve ' + depName);
        }

        that.resolve(deps, cb, index + 1, results);    
      });
    },
    apply: function(args, func, scope) {
      var result = func.apply(scope || core, args);
      return result;
    },
    resolveAndApply: function(deps, func, scope, cb) {
      var that = this;
      this.resolve(deps, function(args) {
        var result = that.apply(args, func, scope);
        if(cb) {
          cb(result);
        }
      });
    },
    process: function(deps, cb) {
      var i, numDeps, obj;
      if(Util.isArray(deps)) {
        for(i = 0, numDeps = deps.length; i < numDeps; i++) {
          obj = deps[i]; 
          if(Util.isString(obj)) {
            this.getDependency(obj, function(obj) {
              cb(obj);
            });
          } else {
            cb(obj);
          }
        }
      } else {
        if(Util.isString(deps)) {
          this.getDependency(deps, function(deps) {
            cb(deps);
          });
        } else {
          cb(deps);
        }
      }
    }
  };

  /** run onReady when document readyState is 'complete' */
  function onDocumentReady(onReady) {
    var readyStateCheckInterval;
    if(!onReady) return;
    if(document.readyState === 'complete') {
      onReady(document);
    } else {
      readyStateCheckInterval = setInterval(function () {
        if(document.readyState === 'complete') {
          onReady(document);
          clearInterval(readyStateCheckInterval);
        }
      }, 10);
    }
  }

  function registerDefinitionObject(result) {
    var key;
    if(Util.isObject(result)) {
      for(key in result) {
        if(result.hasOwnProperty(key)) {
          Injector.register(key, [], (
            function(func) {
              return function() { return func; };
            }
          )(result[key]));
        }
      }
    }
  }

  /** the main interface */
  core = function(keyOrDeps, depsOrFunc, funcOrScope, scope) {
    var result, key;

    // get dependencies
    if(Util.isArray(keyOrDeps)) {
      Injector.resolveAndApply(keyOrDeps, depsOrFunc, funcOrScope);

    // no dependencies, just a function (and optionally a scope)
    } else if(Util.isFunction(keyOrDeps)) {
      Injector.apply([], keyOrDeps, depsOrFunc);

    // register a new module (with dependencies)
    } else if(Util.isArray(depsOrFunc) && Util.isFunction(funcOrScope)) {
      Injector.register(keyOrDeps, depsOrFunc, funcOrScope, scope);

    // register a new module (without dependencies)
    } else if(Util.isFunction(depsOrFunc)) {
      Injector.register(keyOrDeps, [], depsOrFunc, funcOrScope);
    }

    return null;
  };

  core.use = function(deps, func, scope) {
    if(Util.isString(deps)) {
      deps = [deps];      
    }
    core(deps, func, scope);
  };
  core.register = function(key, depsOrFunc, funcOrScope, scope) {
    core(key, depsOrFunc, funcOrScope, scope);
  };
  core.unresolve = function(key) {
    Injector.unresolve(key);
  };
  core.noConflict = function() {
    window[id] = previousOwner;
    return core;
  };

  // TODO: performance
  function getElement(elementId, container, cb) {
    onDocumentReady(function(document) {
      var i, numElements, element, elements, bracketIndex, results = [];
      if(!container) {
        if(!allElements) {
          container = document.getElementsByTagName('body');
          if(!container || !container[0]) {
            return;
          }
          allElements = container[0].querySelectorAll('*');
        }
        elements = allElements;
      } else {
        elements = container.querySelectorAll('*');
      }

      bracketIndex = elementId.indexOf('[]');
      if(bracketIndex !== -1) {
        elementId = elementId.substring(0, bracketIndex);
      }
      for(i = 0, numElements = elements.length; i < numElements; i++) {
        element = elements[i];
        if(element.hasAttribute('data-' + elementId)) {
          results.push(element);
        }
      }
      if(bracketIndex === -1) {
        cb(results[0]);
      } else {
        cb(results);
      }
    }); 
  }

  core.onDocumentReady = onDocumentReady;
  core.log = true;

  /** add these basic modules to the injector */
  Injector
    .setModule('helper', Util).setModule('Helper', Util).setModule('Util', Util)
    .setModule('injector', Injector).setModule('Injector', Injector)
    .setModule('element', getElement)
    .setModule('registerAll', registerDefinitionObject)
    .setModule('appConfig', appConfig);

  /** create global references to core */
  if(window[id]) {
    Util.warn('a preexisting value at namespace \'' + id + '\' has been overwritten.');
    previousOwner = window[id];
  }
  window[id] = core;
  if(!window.register) window.register = core.register;
  if(!window.use) window.use = core.use;

  return core;
})('kilo');