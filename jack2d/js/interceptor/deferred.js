/**
 * Created by Shaun on 10/25/14.
 */

jack2d('Deferred', ['helper', 'chrono', 'obj'], function(Helper, Chrono, Obj) {
  'use strict';

  return function(requiredProps, funcOrRequiredArgs, func) {
    var chronoId, providedArgs, requiredArgs, interceptor;

    // Figure out which arguments are what
    if(!Helper.isArray(requiredProps)) {
      requiredProps = [requiredProps];
    }
    if(Helper.isFunction(funcOrRequiredArgs)) {
      func = funcOrRequiredArgs;
    } else if(!Helper.isArray(funcOrRequiredArgs)) {
      requiredArgs = [funcOrRequiredArgs];
    } else {
      requiredArgs = funcOrRequiredArgs.slice(0);
    }
    if(!Helper.isFunction(func)) {
      Helper.error('Defer: \'func\' must be a function.');
    }

    function propsDefined(context) {
      var i, numProps, requiredProp;
      for(i = 0, numProps = requiredProps.length; i < numProps; i++) {
        requiredProp = requiredProps[i];
        if(Helper.isDefined(context[requiredProp])) {
          continue;
        }
        if(!func._reported) {
          console.log('Jack2d: Defer: waiting for required properties.');
          func._reported = true;
        }
        return false;
      }
      return true;
    }

    function onThenSuccess(args, i) {
      return function(value) {
        args[i] = value;
      };
    }

    function argsDefined(args) {
      var i, numArgs, arg;
      for(i = 0, numArgs = requiredArgs.length; i < numArgs; i++) {
        if(!requiredArgs[i]) {
          continue;
        }
        arg = args[i];
        if(!Helper.isDefined(arg)){
          if(!func._reported) {
            console.log('Jack2d: Defer: waiting for required arguments.');
            func._reported = true;
          }
          return false;
        } else if(arg.then) {
          // if arg is a promise, wait for it to resolve
          args[i] = undefined;
          arg.then(onThenSuccess(args, i));
          return false;
        }
      }
      return true;
    }

    function getChronoFunc(context) {
      return function() {
        if(!propsDefined(context) || !argsDefined(providedArgs)) {
          return;
        }

        Chrono.unRegister(chronoId); // FIXME: calling unregister from a registered function is error prone
        Obj.replaceMethod(
          context,
          interceptor,
          func,
          'Jack2d: Defer: required values have been set.'
        );

        func.apply(context, providedArgs);
      };
    }

    interceptor = function() {
      if(providedArgs) {
        return this;
      }

      providedArgs = arguments;
      chronoId = Chrono.register(getChronoFunc(this), 'deferred');

      return this;
    };

    return interceptor;
  };
});