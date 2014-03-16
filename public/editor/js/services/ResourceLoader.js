/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('resourceLoader', ['$q', '$http', function($q, $http) {
      return function(url) {
        var deferred = $q.defer();

        $http({method: 'GET', url: url}).
          success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).
          error(function(data, status, headers, config) {
            deferred.reject('Error loading resource.');
          });

        return deferred.promise;
      };
    }]);
})();

