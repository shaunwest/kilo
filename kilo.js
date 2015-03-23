/**
 * Created by Shaun on 3/11/2015.
 */

(function() {
  'use strict';

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
    var registered = {_: {}},
      interceptors = [];

    function getInterceptor (matchString) {
      var matches;
      for(var i = 0; i < interceptors.length; i++) {
        var interceptor = interceptors[i];
        if(matches = matchString.match(interceptor.pattern)) {
          return {name: matches[1], cb: interceptor.cb};
        }
      }
      return {name: matchString};
    }

    function getNsObject(nsList, name) {
      var i = 0;
      while(i < nsList.length) {
        var nsObject = registered[nsList[i++]];
        if(nsObject && (name == '*' || nsObject[name])) {
          return nsObject;
        }
      }
    }

    function getNamespace(nsList, name, cb) {
      var nsObject = getNsObject(nsList, name);

      if(!nsObject) {
        cb();
        return;
      }

      if(name == '*') {
        var nsItems = [];
        for(var key in nsObject) {
          nsItems.push(nsObject[key]);
        }
        resolveNamespace(nsItems, cb, {});
        return;
      }

      if(!nsObject[name]) {
        cb();
        return;
      }
      resolveNamespace([nsObject[name]], function(result) {
        cb(result[name]);
      }, {});
    }

    function apply(func, args) {
      return func.apply(Injector, args);
    }

    function resolveNamespace(nsItems, cb, result) {
      var nsItem = nsItems.shift();
      if(!nsItem) {
        cb(result);
        return;
      }
      if(!nsItem.resolved) {
        resolve(nsItem.deps.slice(0), function(args) {
          result[nsItem.name] = nsItem.resolved = apply(nsItem.func, args);
          resolveNamespace(nsItems, cb, result);
        }, [], nsItem.ns);
        return;
      }
      result[nsItem.name] = nsItem.resolved;
      resolveNamespace(nsItems, cb, result);
    }

    function resolve (deps, cb, args, ns) {
      if(!deps) {
        cb();
        return;
      }
      var dep = deps.shift();
      if(!dep) {
        cb(args);
        return;
      }
      var parsedNs = parseNs(dep);
      var nsList = (parsedNs == '_') ? [ns, '_'] : [parsedNs, ns, '_'];
      var interceptor = getInterceptor(parseName(dep));

      getDependency(nsList, interceptor.name, Injector.handlers.slice(0), function(result) {
        if(interceptor.cb) {
          result = interceptor.cb(result);
        }
        args.push(result);

        resolve(deps, cb, args, ns);
      });
    }

    function getDependency (nsList, name, handlers, cb) {
      var handler = handlers.shift();
      if (!handler) {
        cb();
        return;
      }
      handler(nsList, name, function (result) {
        if (result) {
          cb(result);
          return;
        }
        getDependency(nsList, name, handlers, cb);
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
        if (!registered[ns]) {
          registered[ns] = {};
        }
        registered[ns][name] = {
          ns: ns,
          name: name,
          deps: depsOrFunc,
          func: func,
          resolved: null
        };
        return this;
      },
      use: function (depsOrFunc, func) {
        var module;

        // one dependency
        if (Util.isString(depsOrFunc)) {
          depsOrFunc = [depsOrFunc];
        }
        // multiple dependencies
        if (!Util.isArray(depsOrFunc)) {
          return;
        }
        // Not async
        if (!func) {
          resolve(depsOrFunc.slice(0), function (args) {
            module = args[0];
          }, []);
          return module;
        }
        // Async
        setTimeout(function() {
          resolve(depsOrFunc.slice(0), function(args) {
            //func.apply(Injector, args);
            apply(func, args);
          }, []);
        }, 1);
      },
      add: function(name, value, ns) {
        ns = ns || '_';
        registered[ns][name] = {ns: ns, name: name, resolved: value};
        return this;
      },
      unresolve: function(name, ns) {
        ns = ns || '_';
        if(registered[ns] && registered[ns][name]) {
          registered[ns][name].resolved = null;
        }
      },
      addInterceptor: function(pattern, cb) {
        interceptors.push({pattern: pattern, cb: cb});
        return this;
      },
      handlers: [getNamespace, getElement, getHttp]
    };

    Injector.register.lib = Injector.add;

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
      cb();
      return;
    }
    var req = new XMLHttpRequest();

    req.onerror = function() {
      Util.error('Network error.');
    };

    req.onload = function() {
      // ALWAYS check content type?
      var contentType = contentType || this.getResponseHeader('content-type') || '';
      (this.status >= 300) ? cb() :
        cb(parseResponse(contentType, this.responseText), this.status);
    };

    req.open('get', url, true);
    req.send();
  }

  function findElements (container) {
    container = (container) ?
      container.querySelectorAll('*') : document.getElementsByTagName('html');
    if(!container[0]) return;
    return container[0].querySelectorAll('*');
  }

  // TODO: perf
  function getElement (ns, elementId, cb, container) {
    var results = [];
    var elements = findElements(container);
    if(!elements){
      cb();
      return;
    }

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
    (bracketIndex === -1) ?
      cb(results[0]) : cb((results.length == 0) ? undefined : results);
  }

  var config = {
    log: true
  };

  var Injector = getInjector();
  Injector
    .add('Injector', Injector)
    .add('Util', Util)
    .add('element', getElement);

  if(typeof exports != 'undefined') {
    exports['register'] = Injector.register;
    exports['use'] = Injector.use;
  } else {
    if(!window.register) window.register = Injector.register;
    if(!window.use) window.use = Injector.use;
  }
  return config;
})();