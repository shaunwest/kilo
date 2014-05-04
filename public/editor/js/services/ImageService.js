/**
 * Created by shaun on 4/13/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('imageService', ['$q', '$interval', function($q, $interval) {
      var imageWaitInterval = 100;

      function ready(image) {
        var deferred = $q.defer(),
          promise = $interval(function() {
            if(image.complete) {
              $interval.cancel(promise);
              deferred.resolve(image);
            }
          }, imageWaitInterval);

        return deferred.promise;
      }

      return {
        ready: ready
      }
    }]);
})();


