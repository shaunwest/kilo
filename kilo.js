/**
 * Created by Shaun on 3/11/2015.
 */

(function() {
  var id = 'kilo';
  var Util = {
    isDefined: function (value) { return typeof value != 'undefined' },
    def: function (value, defaultValue) { return (typeof value == 'undefined') ? defaultValue : value },
    error: function (message) { throw new Error(id + ': ' + message) },
    warn: function (message) { Util.log('Warning: ' + message) },
    log: function (message) { if(config.log) { console.log(id + ': ' + message) } },
    argsToArray: function (args) { return Array.prototype.slice.call(args) },
    rand: function (max, min) { // move to extra?
      min = min || 0;
      if(min > max) { Util.error('rand: invalid range.'); }
      return Math.floor((Math.random() * (max - min + 1))) + (min);
    }
  };

  var types = ['Array', 'Object', 'Boolean', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
  for(var i = 0; i < types.length; i++) {
    Util['is' + types[i]] = (function(type) {
      return function(obj) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
      };
    })(types[i]);
  }

  function parseName (key) {
    var lastIndex = key.lastIndexOf('.');
    return (lastIndex > -1 && key.indexOf('/') < 0) ?
      key.substr(lastIndex + 1) : key;
  }

  function parseNs (key) {
    var lastIndex = key.lastIndexOf('.');
    return (key.indexOf('/') < 0 && lastIndex > -1) ?
      key.substr(0, lastIndex) : '_';
  }

  function getInjector () {
    var registered = { _: { 'Util': {ns: '_', name: 'Util', resolved: Util} } },
      interceptors = [];

    /*function getInterceptor (interceptors, matchString) {
      var matches;
      for(var i = 0; i < interceptors.length; i++) {
        var interceptor = interceptors[i];
        if(matches = matchString.match(interceptor.pattern)) {
          return {key: matches[1], cb: interceptor.cb};
        }
      }
      return {key: matchString};
    }

    function intercept (key, interceptorFunc) {
      return (interceptorFunc) ? interceptorFunc(key) : key;
    }*/

    /**function getResolved (dep, cb) {
      var ns = parseNs(dep);
      var name = parseName(dep);
      if(name == '*') {
        resolveNamespace(ns, [], cb);
        return;
      }
      cb((resolved[ns]) ? resolved[ns][name] : undefined);
    }*/

    /***function resolveNamespace(ns, cb) {
      var nsObject = registered[ns];
      if (!nsObject) {
        cb(undefined);
        return;
      }
      resolve(getDepsFromNs(ns, nsObject), [], function(result) {

      });
    }

    function getDepsFromNs(ns, nsObject) {
      var deps = [];
      for(var key in nsObject) {
        deps.push(ns + '.' + key);
      }
      return deps;
    }*/

    /*function getNamespaceObject(ns) {
      if (!registered[ns]) {
        return;
      }
      return registered[ns];
    }*/

    /*****function getUnresolved (ns, name, cb) {
      if(resolved[ns] && resolved[ns][name]) {
        var a = {};
        cb(a[name] = resolved[ns][name]);
        return;
      }
      if(!registered[ns] || !registered[ns][name]) {
        cb(undefined);
        return;
      }
      resolve(registered[ns][name].deps.slice(0), [], function(result) {
        if(!resolved[ns]) resolved[ns] = {};
        cb(resolved[ns][name] = result);
      });
    }*/

    /*function getRegistered(deps) {
      var results = [];
      for(var i = 0; i < deps.length; i++) {
        var ns = parseNs(deps[i]);
        var name = parseName(deps[i]);
        if(registered[ns]) {
          if(name == '*') {
            results.push(registered[ns]);
          } else {
            results.push(registered[ns][name]);
          }
        } else {
          results.push(undefined);
        }
      }
      return results;
    }*/

    function getNamespace(ns, name, cb) {
      var nsItems = [];
      var nsObject = registered[ns];
      if(!nsObject) {
        cb(undefined);
        return;
      }
      if(name == '*') {
        for(var key in nsObject) {
          nsItems.push(nsObject[key]);
        }
      } else {
        nsItems.push(nsObject[name]);
      }
      resolveNamespace(nsItems, cb, {});
    }

    function resolveNamespace(nsItems, cb, result) {
      var nsItem = nsItems.shift();
      if(!nsItem) {
        cb(result);
        return;
      }
      if(!nsItem.resolved) {
        resolveNamespaceItem(nsItem, function (resolved) {
          result[resolved.name] = resolved.resolved;
          resolveNamespace(nsItems, cb, result);
        });
        return;
      }
      /*if(!result[nsItem.ns]) {
        result[nsItem.ns] = {};
      }*/
      result[nsItem.name] = nsItem.resolved;
      resolveNamespace(nsItems, cb, result);
    }

    function resolveNamespaceItem(nsItem, cb) {
      resolve(nsItem.deps, function(args) {
      //resolve(nsItem.deps, function() {
        nsItem.resolved = nsItem.func.apply(Injector, args);
        //nsItem.resolved = resolved;
        cb(nsItem);
      }, []);
    }

    // Get the deps for our function, then call it with
    // those deps.
    // deps: array of registered functions
    // results: array of resolved deps
    function resolve (deps, cb, args) {
      var dep = deps.shift();
      if(!dep) {
        cb(args);
        //func.apply(Injector, args);
        return;
      }
      var ns = parseNs(dep);
      var name = parseName(dep);
      getDependency(ns, name, Injector.handlers.slice(0), function(result) {
        if(name == '*') {
          args.push(result);
        } else {
          args.push(result[name]);
        }

        resolve(deps, cb, args);
      });
    }

    function getDependency (ns, name, handlers, cb) {
      var handler = handlers.shift();
      if (!handler) return;
      handler(ns, name, function (result) {
        // TODO: intercept
        if (result) {
          cb(result);
          return;
        }
        getDependency(ns, name, handlers, cb);
      });
    }

    var Injector = {
      register: function (key, depsOrFunc, func) {
        if (Util.isFunction(depsOrFunc)) {
          func = depsOrFunc;
          depsOrFunc = [];
        }
        var ns = parseNs(key);
        var name = parseName(key);
        if (!registered[ns]) registered[ns] = {};
        registered[ns][name] = {ns: ns, name: name, deps: depsOrFunc, func: func, resolved: null};
      },
      use: function (depsOrFunc, func) {
        var module;
        // no dependencies
        if (Util.isFunction(depsOrFunc)) {
          depsOrFunc.apply(Injector, []);
        }
        // one dependency
        if (Util.isString(depsOrFunc)) {
          depsOrFunc = [depsOrFunc];
        }
        // multiple dependencies
        if (!Util.isArray(depsOrFunc)) {
          return;
        }
        if (!func) {
          resolve(depsOrFunc.slice(0), function (_module) {
            module = _module; // FIXME
          }, []);
          return module;
        }

        resolve(depsOrFunc.slice(0), function(args) {
          func.apply(Injector, args);
        }, []);
      },
      handlers: [getNamespace] //, getHttp, getElement]
    };

    return Injector;
  }

  function parseResponse (contentType, responseText) {
    if(contentType.substr(0, 16) == 'application/json') {
      return JSON.parse(responseText);
    }
    return responseText;
  }

  function getHttp (ns, url, cb, contentType) {
    if(url.indexOf('/') < 0) {
      cb(null);
      return;
    }
    var req = new XMLHttpRequest();

    req.onerror = function() {
      Util.error('Network error.');
    };

    req.onload = function() {
      // ALWAYS check content type?
      var contentType = contentType || this.getResponseHeader('content-type') || '';
      (this.status >= 400) ? cb(null) :
        cb(parseResponse(contentType, this.responseText), this.status);
    };

    req.open('get', url, true);
    req.send();
  }

  function findElements () {
    var container = document.getElementsByTagName('html');
    if(!container[0]) return;
    return container[0].querySelectorAll('*');
  }

  // TODO: perf
  function getElement (ns, elementId, cb, container) {
    var results = [];
    var elements = (!container) ? findElements() : container.querySelectorAll('*');

    var bracketIndex = elementId.indexOf('[]');
    if(bracketIndex != -1) {
      elementId = elementId.substring(0, bracketIndex);
    }
    for(var i = 0, numElements = elements.length; i < numElements; i++) {
      var element = elements[i];
      if(element.hasAttribute('data-' + elementId)) {
        results.push(element);
      }
    }
    (bracketIndex === -1) ? cb(results[0]) : cb((results.length == 0) ? null : results);
  }

  var config = {
    log: true
  };

  var Injector = getInjector();
  if(!window.register) window.register = Injector.register;
  if(!window.use) window.use = Injector.use;

  return config;
})();