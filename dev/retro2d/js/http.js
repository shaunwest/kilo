/**
 * Created by Shaun on 5/3/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.http = retro2d.http || {};

  function throwError(message) {
    throw(message);
  }

  retro2d.http.get = function(url) {
    var promise = (retro2d.promise) ?
        retro2d.promise() :
        throwError('Exception: http.get: retro2d/util is required'),
      req = new XMLHttpRequest();

    req.addEventListener('progress', function(event) {
      promise.update(event.loaded, event.total);
    }, false);

    req.addEventListener('error', function(event) {
      promise.reject();
    }, false);

    req.onload = function() {
      switch(this.status) {
        case 500:
          promise.reject();
          break;
        case 304:
          console.log('cached');
          promise.resolve(this.responseText, this.status);
          break;
        default:
          promise.resolve(this.responseText, this.status);
      }
    };
    req.open('get', url, true);
    req.send();

    return promise;
  };
})();


