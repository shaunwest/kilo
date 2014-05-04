/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('configService', ['$q', '$http', 'gameId', function($q, $http, gameId) {
      var config = null;

      function getConfig() {
        var deferred = $q.defer();

        if(config) {
          deferred.resolve(config);
        } else {
          $http({method: 'GET', url: gameId + '/config'}).
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

      function saveConfig() {

      }

      return {
        getConfig: getConfig,
        saveConfig: saveConfig
      };
    }]);
})();

