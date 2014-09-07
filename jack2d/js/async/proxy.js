/**
 * Created by Shaun on 9/3/14.
 */

jack2d('Proxy', ['helper'], function(Helper) {
  'use strict';

  function Proxy(targetObject, methodQueue, resultList) {
    var proxyObject;

    methodQueue = methodQueue || [];
    resultList = resultList || [];

    proxyObject = augmentMethods(targetObject, methodQueue, resultList); //, interceptor);
    proxyObject.targetObject = targetObject;
    proxyObject.set = augmentMethod(methodQueue, resultList, function(key, value) {
      this[key] = value;
      return this;
    }, targetObject); //, interceptor);

    return proxyObject;
  }

  function augmentMethods(targetObject, methodQueue, resultList) {
    var proxyObject = {
      methodQueue: methodQueue,
      resultList: resultList
    };
    Object.keys(targetObject).forEach(function(prop) {
      if(!Helper.isFunction(targetObject[prop])) {
        return;
      }
      proxyObject[prop] = augmentMethod(methodQueue, resultList, targetObject[prop], targetObject); //, interceptor);
    });
    return proxyObject;
  }

  function augmentMethod(methodQueue, resultList, method, context) {
    return function() {
      var methodData = {method: method, args: Helper.argsToArray(arguments), context: context};
      /*if(interceptor) {
        interceptor(methodData);
      }*/
      if(methodQueue.length === 0) {
        methodQueue.push(methodData);
        executeMethodQueue(methodQueue, resultList);
      } else {
        methodQueue.push(methodData);
      }
      return this;
    };
  }

  // should something be done with result?
  function executeMethodQueue(methodQueue, resultList) {
    var methodData, result;

    methodData = methodQueue[0];
    if(!methodData) {
      return;
    }

    result = methodData.method.apply(methodData.context, methodData.args);
    resultList.push(result);

    if(result && result.then) {
      result.then(function(data) {
        methodQueue.shift();
        executeMethodQueue(methodQueue, resultList);
      });
    } else {
      methodQueue.shift();
      executeMethodQueue(methodQueue, resultList);
    }
  }

  return Proxy;
});