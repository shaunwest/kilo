/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('interface.services', [], function($provide) {
        $provide.factory('configLoader', function($q, $http) {
            return function(appId) {
                var deferred = $q.defer();

                $http({method: 'GET', url: '/data/' + appId + '/config.json'}).
                    success(function(data, status, headers, config) {
                        deferred.resolve(data);
                    }).
                    error(function(data, status, headers, config) {
                        deferred.reject('Unable to load config');
                    });

                return deferred.promise;
            }
        });
    }).
        value('version', '0.0.1');

})();
