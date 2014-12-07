/**
 * Created by Shaun on 5/1/14.
 */

(function(id) {
  'use strict';

  var core, Util, Injector, types, appConfig = {}, gids = {}, elementMap = {}, previousOwner = undefined;
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
      this.unresolved[key] = {deps: deps, func: func, scope: scope};
      return this;
    },
    unresolve: function(key) {
      if(this.modules[key]) {
        delete this.modules[key];
      }
    },
    setModule: function(key, module) { // save a module without doing dependency resolution
      this.modules[key] = module;
      return this;
    },
    getDependency: function(key) {
      var module = this.modules[key];
      if(module) {
        return module;
      }

      module = this.unresolved[key];
      if(!module) {
        Util.warn('Module \'' + key + '\' not found');
        return null;
      }

      Util.log('Resolving dependencies for \'' + key + '\'');
      module = this.modules[key] = this.resolveAndApply(module.deps, module.func, module.scope);
      if(Util.isObject(module)) {
        module.getType = function() { return key; };
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
          Util.warn('Can\'t resolve ' + depName);
        }
      }
      return args;
    },
    apply: function(args, func, scope) {
      return func.apply(scope || core, args);
    },
    resolveAndApply: function(deps, func, scope) {
      return this.apply(this.resolve(deps), func, scope);
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
      result = Injector.resolveAndApply(keyOrDeps, depsOrFunc, funcOrScope);
      registerDefinitionObject(result);

    // no dependencies, just a function (and optionally a scope)
    } else if(Util.isFunction(keyOrDeps)) {
      result = Injector.apply([], keyOrDeps, depsOrFunc);
      registerDefinitionObject(result);

    // register a new module (with dependencies)
    } else if(Util.isArray(depsOrFunc) && Util.isFunction(funcOrScope)) {
      Injector.register(keyOrDeps, depsOrFunc, funcOrScope, scope);

    // register a new module (without dependencies)
    } else if(Util.isFunction(depsOrFunc)) {
      Injector.register(keyOrDeps, [], depsOrFunc, funcOrScope);

    // get a module
    } else if(keyOrDeps && !Util.isDefined(depsOrFunc)) {
      return Injector.getDependency(keyOrDeps);
    }

    return null;
  };

  core.unresolve = function(key) {
    Injector.unresolve(key);
  };
  core.noConflict = function() {
    window[id] = previousOwner;
    return core;
  };

  function findElement(elementId, elements, cb) {
    var i, numElements, selectedElement;

    for(i = 0, numElements = elements.length; i < numElements; i++) {
      selectedElement = elements[i];
      if(selectedElement.hasAttribute('data-' + elementId)) {
        if(!elementMap[elementId]) {
          elementMap[elementId] = [];
        }
        elementMap[elementId].push(selectedElement);
        cb(selectedElement);
      }
    }
  }

  function executeElement(elementId, elements, deps, func, containerElement) {
    if(elementMap.hasOwnProperty(elementId)) {
      Util.warn('element \'' + elementId + '\' already defined');
      elementMap[elementId].forEach(function(element) {
        callElementFunc(element);
      });
    } else {
      findElement(elementId, elements, callElementFunc);
    }

    function callElementFunc(element) {
      var context = (containerElement) ? {container: containerElement, element: element} : element;
      if(deps) {
        func.apply(context, Injector.resolve(deps));
      } else {
        func.call(context);
      }
    }
  }

  // TODO: decide if element() will be moved to new package (kilo-element)
  core.element = function(elementId, funcOrDeps, func) {
    var deps, allElements;

    if(Util.isFunction(funcOrDeps)) {
      func = funcOrDeps;
    } else if(Util.isArray(funcOrDeps)) {
      deps = funcOrDeps;
    } else {
      Util.error('element: second argument should be function or dependency array.');
    }

    onDocumentReady(function(document) {
      var body;
      if(!allElements) {
        body = document.getElementsByTagName('body');
        if(!body || !body[0]) {
          return;
        }
        allElements = body[0].querySelectorAll('*');
      }


      executeElement(elementId, allElements, deps, func);
    });

    return this;
  };
  core.subElement = function(elementId, containerId, funcOrDeps, func) {
    var deps;

    if(Util.isFunction(funcOrDeps)) {
      func = funcOrDeps;
    } else if(Util.isArray(funcOrDeps)) {
      deps = funcOrDeps;
    } else {
      Util.error('subElement: third argument should be function or dependency array.');
    }

    onDocumentReady(function() {
      var i, elements, numContainers, containerElement;
      var containerElements = elementMap[containerId];
      for(i = 0, numContainers = containerElements.length; i < numContainers; i++) {
        containerElement = containerElements[i];
        elements = containerElement.querySelectorAll('*');
        executeElement(elementId, elements, deps, func, containerElement);
      }
    });

    return this;
  };
  core.onDocumentReady = core.ready = onDocumentReady;
  core.log = true;

  /** add these basic modules to the injector */
  Injector
    .setModule('helper', Util).setModule('Helper', Util).setModule('Util', Util)
    .setModule('injector', Injector).setModule('Injector', Injector)
    .setModule('Element', core.element).setModule('SubElement', core.subElement)
    .setModule('appConfig', appConfig);

  /** create global references to core */
  if(window[id]) {
    Util.warn('a preexisting value at namespace \'' + id + '\' has been overwritten.');
    previousOwner = window[id];
  }
  window[id] = core;
  if(!window.define) window.define = core;
  if(!window.require) window.require = core;

  return core;
})('kilo');