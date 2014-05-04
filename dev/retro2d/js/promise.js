/**
 * Created by Shaun on 5/1/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.promise = function() {
    var callbacks = [],
      progressCallback,
      errorCallback,
      obj = {
        resolve: resolve,
        reject: reject,
        update: update,
        ready: ready,
        error: error,
        progress: progress
      };

    function resolve() {
      var retVal,
        args = arguments;
      callbacks.forEach(function(callback) {
        if(typeof callback === 'function') {
          if(typeof retVal === 'undefined') {
            retVal = callback.apply(obj, args);
          } else {
            retVal = callback.call(obj, retVal);
          }
        }
      });
    }

    function update() {
      if(typeof progressCallback === 'function') {
        progressCallback.apply(obj, arguments);
      }
    }

    function reject() {
      if(typeof errorCallback === 'function') {
        errorCallback.apply(obj, arguments);
        callbacks.length = 0;
      }
    }

    function progress(cb) {
      progressCallback = cb;
      return obj;
    }

    function error(cb) {
      errorCallback = cb;
      return obj;
    }

    function ready(cb) {
      callbacks.push(cb);
      return obj;
    }

    return obj;
  };
})();