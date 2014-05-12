/**
 * Created by Shaun on 5/8/14.
 */

jack2d('promisePool', ['helper'], function(helper) {
  'use strict';

  var count = 0,
    readyCallback;

  function add(promise) {
    promise.ready(function() {
      count--;
      if(count === 0 && helper.isFunction(readyCallback)) {
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
});

