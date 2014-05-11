/**
 * Created by Shaun on 5/8/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';


  retro2d.promisePool = function() {
    var count = 0,
      readyCallback;

    function add(promise) {
      promise.ready(function() {
        count--;
        if(count === 0 && retro2d.isFunction(readyCallback)) {
          readyCallback();
        }
      });
      count++;
    }

    function ready(cb) {
      readyCallback = cb;
    }

    return {
      add: add,
      ready: ready
    };
  };
})();

