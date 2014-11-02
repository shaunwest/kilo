/**
 * Created by Shaun on 9/27/14.
 */

jack2d('RequiresInit', ['helper', 'obj'], function(Helper, Obj) {
  'use strict';

  return function(requiredProps, initFunc, func) {
    if(!Helper.isArray(requiredProps)) {
      requiredProps = [requiredProps];
    }
    if(!Helper.isFunction(initFunc)) {
      Helper.error('RequiresInit: \'initFunc\' must be a function.');
    }
    var requiresFunc = function() {
      var i, requiredProp, context = this;
      var numValues = requiredProps.length;

      if(numValues > 0) {
        for(i = 0; i < numValues; i++) {
          requiredProp = requiredProps[i];
          if(!context[requiredProp]) { // FIXME: check if defined
            initFunc.call(context, context);
            //return context;
          }
        }
      }

      Obj.replaceMethod(
        context,
        requiresFunc,
        func,
        'Jack2d: RequiresInit: requirements fulfilled.'
      );
      return func.apply(context, arguments);
    };
    return requiresFunc;
  };
});