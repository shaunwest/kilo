/**
 * Created by Shaun on 5/3/14.
 */

jack2d('http', ['promiser'], function(promiser) {
  'use strict';

  function parseResponse(contentType, responseText) {
    switch(contentType) {
      case 'application/json':
        return JSON.parse(responseText);
      default:
        return responseText;
    }
  }

  function get(url, targetContentType) {
    var promise = promiser.get(),
      req = new XMLHttpRequest();

    req.addEventListener('progress', function(event) {
      promiser.update(promise, event.loaded, event.total);
    }, false);

    req.addEventListener('error', function(event) {
      promiser.reject(promise);
    }, false);

    req.onload = function() {
      var contentType = targetContentType || this.getResponseHeader('content-type');

      switch(this.status) {
        case 500:
          promiser.reject(promise, this.statusText, this.status);
          break;
        case 404:
          promiser.reject(promise, this.statusText, this.status);
          break;
        case 304:
          promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
          break;
        default:
          promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
      }
    };
    req.open('get', url, true);
    req.send();

    return promise;
  }

  return {
    get: get
  };
});
