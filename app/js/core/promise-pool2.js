/**
 * Created by Shaun on 5/8/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.promisePool2 = function() {
    var count = 0,
      callbacks = [],
      results;

    function add(callback) {
      var args = Array.prototype.slice.call(arguments, 1);
      callbacks.push([callback, args]);
      count++;
    }

    function go(ready) {
      if(callbacks.length) {
        results = [];

        callbacks.forEach(function(callback) {
          var callbackFunc = callback[0],
            callbackArgs = callback[1],
            promise = callbackFunc.apply(null, callbackArgs);

          promise.ready(function() {
            results.push(Array.prototype.slice.call(arguments));
            count--;
            if(count === 0) {
              ready(results);
            }
          });
        });

        callbacks.length = 0;
      }
    }

    return {
      add: add,
      go: go
    };
  };
})();