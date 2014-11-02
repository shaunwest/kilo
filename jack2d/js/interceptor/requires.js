/**
 * Created by Shaun on 9/27/14.
 */

// TODO: should maybe be renamed to imply that the intercepted function needs to be called
// again manually when requirements are fulfilled
jack2d('Requires', ['obj'], function(Obj) {
  'use strict';

  return function(requiredProps, func) {
    // TODO: check for array in first arg
    var requiresFunc = function() {
      var i, numValues, requiredProp, context = this;
      for(i = 0, numValues = requiredProps.length; i < numValues; i++) {
        requiredProp = requiredProps[i];
        if(!context[requiredProp]) {
          if(!func._reported) {
            console.log('Jack2d: Requires: \'' + requiredProp + '\' is required.');
            func._reported = true;
          }
          return context; // TODO: is this the appropriate value to return?
        }
      }

      // FIXME: requiredProp only refers to the LAST required prop
      Obj.replaceMethod(
        context,
        requiresFunc,
        func,
        'Jack2d: Requires: \'' + requiredProp + '\' requirement fulfilled.'
      );
      return func.apply(context, arguments);
    };
    return requiresFunc;
  };
});