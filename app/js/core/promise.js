/**
 * Created by Shaun on 5/1/14.
 */

var retro2d = retro2d || {};

retro2d.promiser = retro2d.injector.resolve(['retro2d'], function(retro2d) {
  'use strict';

  /*var callbacks = [],
    progressCallbacks = [],
    errorCallbacks = [],*/
  var obj;

  function resolve(promise) {
    var retVal,
      args = Array.prototype.slice.call(arguments, 1);
    promise.callbacks.forEach(function(callback) {
      if(typeof callback === 'function') {
        if(typeof retVal === 'undefined') {
          retVal = callback.apply(obj, args);
        } else {
          retVal = callback.call(obj, retVal);
        }
      }
    });

    promise.callbacks.length = 0;
  }

  function update(promise) {
    var args = Array.prototype.slice.call(arguments, 1);
    promise.progressCallbacks.forEach(function(callback) {
      if(retro2d.isFunction(callback)) {
        callback.apply(obj, args);
      }
    });

    promise.progressCallbacks.length = 0;
  }

  function reject(promise) {
    var args = Array.prototype.slice.call(arguments, 1);
    promise.errorCallbacks.forEach(function(callback) {
      if(retro2d.isFunction(callback)) {
        callback.apply(obj, args);
      }
    });

    promise.callbacks.length = 0;
    promise.errorCallbacks.length = 0;
  }

  /*function progress(cb) {
    progressCallbacks.push(cb);
    return obj;
  }

  function error(cb) {
    errorCallbacks.push(cb);
    return obj;
  }

  function ready(cb) {
    callbacks.push(cb);
    return obj;
  }*/

  function get() {
    return {
      callbacks: [],
      progressCallbacks: [],
      errorCallbacks: [],
      ready: function(cb) {
        this.callbacks.push(cb);
        return this;
      },
      error: function(cb) {
        this.errorCallbacks.push(cb);
        return this;
      },
      progress: function(cb) {
        this.progressCallbacks.push(cb);
        return this;
      }
    };
  }

  obj = {
    resolve: resolve,
    reject: reject,
    update: update,
    get: get
  };

  return obj;
});

