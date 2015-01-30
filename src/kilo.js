/**
 * Created by Shaun on 5/1/14.
 * TODO:
 * Cut down size
 * Add promise support to Injector
 */

(function(id) {
  var //gids = {},
    allElements, previousOwner;

  var Util = {
    isDefined: function(value) { return typeof value != 'undefined' },
    isBoolean: function(value) { return typeof value == 'boolean' },
    def: function(value, defaultValue) { return (typeof value == 'undefined') ? defaultValue : value },
    error: function(message) { throw new Error(id + ': ' + message) },
    warn: function(message) { Util.log('Warning: ' + message) },
    log: function(message) { if(core.log) { console.log(id + ': ' + message) } },
    argsToArray: function(args) { return Array.prototype.slice.call(args) },
    //getGID: function(prefix) {
    //  prefix = Util.def(prefix, '');
    //  gids[prefix] = Util.def(gids[prefix], 0);
    //  return prefix + (++gids[prefix]);
    //},
    rand: function(max, min) { // move to extra?
      min = min || 0;
      if(min > max || max < min) { Util.error('rand: invalid range.'); }
      return Math.floor((Math.random() * (max - min + 1))) + (min);
    }
  };

  var types = ['Array', 'Object', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp']; //, 'HTMLImageElement'];
  for(var i = 0; i < types.length; i++) {
    Util['is' + types[i]] = (function(type) { 
      return function(obj) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
      }; 
    })(types[i]);
  }

  function getInterceptor(interceptors, matchString) {
    var matches;
    for(var i = 0; i < interceptors.length; i++) {
      var interceptor = interceptors[i];
      if(matches = matchString.match(interceptor.pattern)) {
        return {key: matches[1], cb: interceptor.cb};
      }
    }
    return {key: matchString};
  }

  function intercept(module, interceptorFunc) {
    if(interceptorFunc) {
      return interceptorFunc(module);
    }
    return module;
  }

  var Injector = {
    unresolved: {},
    modules: {
      'Util': Util,
      'element': getElement,
      'httpGet': httpGet
    },
    interceptors: [],
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
    // possible removal candidate (just use Injector.modules['myModule'] = ...)
    setModule: function(key, module) { // save a module without doing dependency resolution
      this.modules[key] = module;
      return this;
    },
    getDependency: function(key, cb) {
      var interceptor = getInterceptor(this.interceptors, key);
      key = interceptor.key;
      var modules = this.modules;
      var module = modules[key];

      if(module) {
        cb(intercept(module, interceptor.cb));
        return;
      }

      if(key.indexOf('/') > -1) {
        modules.httpGet(key, cb);
        return;
      }

      module = this.unresolved[key];
      if(!module) {
        getElement(key, 0, function(element) {
          (element) ?
            cb(element = intercept(element, interceptor.cb)) :
            Util.warn('\'' + key + '\' not found');
        });
        return;
      }

      Util.log('Resolving for \'' + key + '\'');
      this.resolveAndApply(module.deps, module.func, module.scope, function(module) {
        //if(Util.isObject(module)) { // doesn't work on mixins
        //  module.getType = function() { return key; };
        //}
        cb(modules[key] = intercept(module, interceptor.cb));
      });

      return;
    },
    resolve: function(deps, cb, index, results) {
      var that = this; // FIXME

      //index = Util.def(index, 0);

      var depName = deps[index];
      if(!depName) {
        cb(results);
        return;
      }
      
      this.getDependency(depName, function(dep) {
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
        if(cb && Util.isFunction(cb)) {
          cb(result);
        }
      }, 0, []);
    },
    addInterceptor: function(pattern, cb) {
      this.interceptors.push({pattern: pattern, cb: cb});
    },
    // MOVE TO EXTRA?
    /*process: function(deps, cb) {
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
    }*/
  };

  /** run onReady when document readyState is 'complete' */
  // remove, require kilo to be included at bottom of document
  /*function onDocumentReady(onReady) {
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
  }*/

  // move to Extra
  /*function registerDefinitionObject(result) {
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
  }*/

  function findElements() {
    var container = document.getElementsByTagName('html');
    if(!container[0]) return;
    return container[0].querySelectorAll('*');
  }

  // TODO: performance
  function getElement(elementId, container, cb) {
    //onDocumentReady(function(document) {
      var element, results = [];
      var elements = (!container) ? findElements() : container.querySelectorAll('*');

      var bracketIndex = elementId.indexOf('[]');
      if(bracketIndex != -1) {
        elementId = elementId.substring(0, bracketIndex);
      }
      for(var i = 0, numElements = elements.length; i < numElements; i++) {
        element = elements[i];
        if(element.hasAttribute('data-' + elementId)) {
          results.push(element);
        }
      }
      (bracketIndex === -1) ? cb(results[0]) : cb(results);
    //}); 
  }

  function parseResponse(contentType, responseText) {
    var appJson = 'application/json';
    switch(contentType) {
      case appJson:
      case appJson + '; charset=utf-8':
        return JSON.parse(responseText);
      default:
        return responseText;
    }
  }

  function httpGet(url, onComplete, contentType) {
    var req = new XMLHttpRequest();

    // REMOVE progress
    /*if(onProgress) {
      req.addEventListener('progress', function(event) {
        onProgress(event.loaded, event.total);
      }, false);
    }*/

    req.onerror = function(event) {
      Util.error('Network error.');
    };

    req.onload = function() {
      // ALWAYS check content type?
      var contentType = contentType || this.getResponseHeader('content-type');
      (this.status >= 400) ? onComplete(this.statusText, this.status) :
          onComplete(parseResponse(contentType, this.responseText), this.status);
    };

    req.open('get', url, true);
    req.send();
  }

  function register(key, depsOrFunc, funcOrScope, scope) {
    // register a new module (with dependencies)
    if(Util.isArray(depsOrFunc) && Util.isFunction(funcOrScope)) {
      Injector.register(key, depsOrFunc, funcOrScope, scope);
    } 
     // register a new module (without dependencies)
    else if(Util.isFunction(depsOrFunc)) {
      Injector.register(key, [], depsOrFunc, funcOrScope);
    }
  }

  var core = {
    use: function(depsOrFunc, funcOrScope, scope, cb) {
      // no dependencies
      if(Util.isFunction(depsOrFunc)) {
        var result = Injector.apply([], depsOrFunc, funcOrScope);
        if(cb) {
          cb(result);
        }
      } 
      // one dependency
      if(Util.isString(depsOrFunc)) {
        depsOrFunc = [depsOrFunc]; 
      }
      // multiple dependencies
      if (Util.isArray(depsOrFunc)) {
        Injector.resolveAndApply(depsOrFunc, funcOrScope, scope, cb);
      } 
    },

    register: function(key, depsOrFunc, funcOrScope, scope) {
      if(Util.isFunction(depsOrFunc) || Util.isFunction(funcOrScope)) {
        return register(key, depsOrFunc, funcOrScope, scope);
      }
      /*return {
        depends: function() {
          depsOrFunc = Util.argsToArray(arguments);
          return this;
        },
        factory: function(func, scope) {
          register(key, depsOrFunc, func, scope)
        }
      };*/
    },

    unresolve: function(key) {
      Injector.unresolve(key);
    },

    noConflict: function() {
      window[id] = previousOwner;
      return core;
    }
  }

  /*core.use.defer = function(depsOrFunc, funcOrScope, scope) {
    return function(cb) {
      core.use(depsOrFunc, funcOrScope, scope, cb);
    };
  };*/

  // TODO: try to get rid of this
  core.use.run = function(dep, scope) {
    var cb, done, result;
    return function() {
      var args = arguments;

      core.use(dep, function(dep) {
        if(Util.isFunction(dep)) {
          result = dep.apply(null, args);
          if(cb) {
            cb(result);
          }
          done = true;
          return result;
        }
      }, scope);

      return { 
        on: function(_cb) {
          if(done) {
            _cb(result);
          } else {
            cb = _cb;
          }      
        }
      };
    };
  };

 
  //core.onDocumentReady = onDocumentReady;
  core.log = true;

  /** add these basic modules to the injector */
  Injector
    //.setModule('Util', Util)
    .setModule('Injector', Injector);
    //.setModule('element', getElement)
    //.setModule('registerAll', registerDefinitionObject)
    //.setModule('httpGet', httpGet);

  /** create references to core */
  if(typeof window != 'undefined') {
    if(window[id]) {
      //Util.warn('a preexisting value at namespace \'' + id + '\' has been overwritten.');
      previousOwner = window[id];
    }
    window[id] = core;
    if(!window.register) window.register = core.register;
    if(!window.use) window.use = core.use;
  }

  if(typeof exports != 'undefined') {
    exports[id] = core; 
    exports['register'] = core.register;
    exports['use'] = core.use;   
  }

  return core;
})('kilo');