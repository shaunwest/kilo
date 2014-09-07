/**
 * Created by Shaun on 6/22/14.
 */

jack2d('proxy2', ['helper'], function(helper) {
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

  function defer(objOrFunc) {
    if(helper.isFunction(objOrFunc)){
      return deferFunction(objOrFunc);
    } else {
      return deferObject(objOrFunc);
    }
  }

  function deferObject(obj) {
    Object.keys(obj).forEach(function(prop) {
      if(!helper.isFunction(obj[prop])) {
        return;
      }
      obj[prop] = deferFunction(obj[prop]);
    });

    return obj;
  }

  function deferFunction(func) {
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
      func, args;

    while(deferredFunctions.length > 0) {
      func = deferredFunctions.shift();
      args = deferredFunctions.shift();
      func.apply(context, args);
    }

    context.executedDeferred = true;
  }

  return {
    defer: defer,
    executeDeferred: executeDeferred
  };
});