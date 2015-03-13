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

  function getName(key) {
    var lastIndex = key.lastIndexOf('.');
    return (lastIndex > -1 && key.indexOf('/') < 0) ?
      key.substr(lastIndex + 1) : key;
  }

  function getNs(key) {
    var lastIndex = key.lastIndexOf('.');
    return (key.indexOf('/') < 0 && lastIndex > -1) ?
      key.substr(0, lastIndex) : '_';
  }

  function getInjector() {
    var registered = { _: {} },
      resolved = {_: { 'Util': Util} },
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

    function getResolved (ns, name, cb) {
      cb((resolved[ns]) ? resolved[ns][name] : null);
    }

    function getUnresolved (ns, name, cb) {
      if (!registered[ns]) {
        cb(null);
        return;
      }
      var unresolved = registered[ns][name];
      if (!unresolved) {
        cb(null);
        return;
      }
      resolve(unresolved.deps, unresolved.func, [], function(result) {
        if(!resolved[ns]) resolved[ns] = {};
        cb(resolved[ns][name] = result);
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

    function resolve (deps, func, results, cb) {
      var dep = deps.shift();
      if (!dep) {
        var result = func.apply(Injector, results);
        if (cb) cb(result);
        return;
      }
      var ns = getNs(dep),
        name = getName(dep);

      getDependency(ns, name, Injector.handlers.slice(0), function(result) {
        results.push(result);
        resolve(deps, func, results, cb);
      });
    }

    var Injector = {
      register: function (key, depsOrFunc, func) {
        if (Util.isFunction(depsOrFunc)) {
          func = depsOrFunc;
          depsOrFunc = [];
        }
        var ns = getNs(key);
        if (!registered[ns]) registered[ns] = {};
        registered[ns][getName(key)] = {deps: depsOrFunc, func: func};
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
        if (Util.isArray(depsOrFunc)) {
          if (!func) {
            resolve(depsOrFunc.slice(0), function (_module) {
              module = _module;
            }, []);
          } else {
            resolve(depsOrFunc.slice(0), func, []);
          }
        }
        return module;
      },
      handlers: [getResolved, getHttp, getUnresolved, getElement]
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