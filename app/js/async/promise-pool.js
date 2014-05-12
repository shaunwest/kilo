/**
 * Created by Shaun on 5/8/14.
 */

jack2d('promisePooler', ['helper'], function(helper) {
  'use strict';

  function add(promisePool, promise) {
    promise.ready(function() {
      promisePool.count--;
      if(promisePool.count === 0 && helper.isFunction(promisePool.readyCallback)) {
        promisePool.readyCallback();
      }
    });
    promisePool.count++;
  }

  function get() {
    return {
      count: 0,
      readyCallback: null,
      ready: function(cb) {
        this.readyCallback = cb;
      }
    };
  }

  return {
    add: add,
    get: get
  };
});

