/**
 * Created by Shaun on 6/22/14.
 */

jack2d('deferred', ['helper'], function(helper) {
  'use strict';

  var deferredObjects,
    lastDeferredId;

  init();

  function init() {
    reset();
  }

  function reset() {
    deferredObjects = {};
    lastDeferredId = 0;
  }

  function deferAll(obj) {
    Object.keys(obj).forEach(function(prop) {
      if(!helper.isFunction(obj[prop])) {
        return;
      }
      obj[prop] = defer(obj[prop]);
    });

    return obj;
  }

  function defer(func) {
    if(!helper.isFunction(func)) {
      return func;
    }
    // this function gets called as a method of an object
    // therefore 'this' refers to the object
    return function() {
      if(!this.executedDeferred) {
        if(!this.deferredId) {
          this.deferredId = ++lastDeferredId;
          deferredObjects[this.deferredId] = [];
        }
        // this is to avoid using new objects (that would need to be GC'd)
        deferredObjects[this.deferredId].push(func);
        deferredObjects[this.deferredId].push(arguments);
      } else {
        return func.apply(this, arguments);
      }
      return this;
    };
  }

  function executeDeferred(context) {
      var deferredFunctions = deferredObjects[context.deferredId],
        deferredFunctionCount = deferredFunctions.length,
        i;

    // FIXME: do while with pop
    for(i = 0; i < deferredFunctionCount; i+=2) {
      deferredFunctions[i].apply(context, deferredFunctions[i+1]);
    }

    context.executedDeferred = true;
  }

  return {
    deferAll: deferAll,
    defer: defer,
    executeDeferred: executeDeferred
  };
});