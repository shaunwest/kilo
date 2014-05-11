/**
 * Created by Shaun on 5/3/14.
 */

var retro2d = retro2d || {};

(function() {
  'use strict';

  retro2d.http = retro2d.http || {};

  function parseResponse(contentType, responseText) {
    switch(contentType) {
      case 'application/json':
        return JSON.parse(responseText);
      default:
        return responseText;
    }
  }

  retro2d.http.get = function(url) {
    var promise = retro2d.promiser.get(),
      req = new XMLHttpRequest();

    req.addEventListener('progress', function(event) {
      retro2d.promiser.update(promise, event.loaded, event.total);
    }, false);

    req.addEventListener('error', function(event) {
      retro2d.promiser.reject(promise);
    }, false);

    req.onload = function() {
      var contentType = this.getResponseHeader('content-type');

      switch(this.status) {
        case 500:
          retro2d.promiser.reject(promise, this.statusText, this.status);
          break;
        case 404:
          retro2d.promiser.reject(promise, this.statusText, this.status);
          break;
        case 304:
          retro2d.promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
          break;
        default:
          retro2d.promiser.resolve(promise, parseResponse(contentType, this.responseText), this.status);
      }
    };
    req.open('get', url, true);
    req.send();

    return promise;
  };
})();


