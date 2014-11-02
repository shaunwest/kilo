/**
 * Created by Shaun on 11/1/14.
 */

jack2d('Construct', ['helper'], function(Helper) {
  'use strict';

  function restoreFuncs(targetObject, originalFuncs) {
    Object.keys(originalFuncs).forEach(function(prop) {
      targetObject[prop] = originalFuncs[prop];
    });
  }

  return function(constructorFunc, targetObject) {
    var originalFuncs = {};
    Object.keys(targetObject).forEach(function(prop) {
      var func;
      if(Helper.isFunction(targetObject[prop])) {
        func = targetObject[prop];
        originalFuncs[prop] = func;
        targetObject[prop] = function() {
          constructorFunc(targetObject);
          restoreFuncs(targetObject, originalFuncs);
          return func.apply(targetObject, arguments);
        };
      }
    });

    return targetObject;
  };
});
