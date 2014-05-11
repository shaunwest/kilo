/**
 * Created by Shaun on 5/3/14.
 */

jack2d.http = jack2d.injector.resolve(['jack2d'], function(jack2d) {
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
    var promise = jack2d.promiser.get(),
      req = new XMLHttpRequest();

    req.addEventListener('progress', function(event) {
      jack2d.promiser.update(promise, event.loaded, event.total);
    }, false);

    req.addEventListener('error', function(event) {
      jack2d.promiser.reject(promise);
    }, false);

    req.onload = function() {
      var contentType = targetContentType || this.getResponseHeader('content-type');

      switch(this.status) {
        case 500:
          jack2d.promiser.reject(promise, this.statusText, this.status);
          break;
        case 404:
          jack2d.promiser.reject(promise, this.statusText, this.status);
          break;
        case 304:
          jack2d.promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
          break;
        default:
          jack2d.promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
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


