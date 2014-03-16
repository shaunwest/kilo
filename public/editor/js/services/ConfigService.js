/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('configService', ['$q', '$http', function($q, $http) {
      var config = null;

      function getConfig(appId) {
        var deferred = $q.defer();

        if(config) {
          deferred.resolve(config);
        } else {
          $http({method: 'GET', url: appId + '/config'}).
            success(function(data, status, headers, config) {
              config = data;
              deferred.resolve(config);
            }).
            error(function(data, status, headers, config) {
              deferred.reject('Unable to load config');
            });
        }

        return deferred.promise;
      }

      return {
        getConfig: getConfig
      };
    }]);
})();

