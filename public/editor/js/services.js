/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('editor.services', [], function($provide) {
        $provide.factory('resourceLoader', ['$q', '$http', function($q, $http) {
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
            };
        });

        $provide.factory('sourcesList', function(resourceLoader) {
            return function(appId) {
                return resourceLoader('/' + appId + '/sources');
            };
            /*return function(appId) {
                var deferred = $q.defer();

                $http({method: 'GET', url: '/' + appId + '/sources'}).
                    success(function(data, status) {
                        deferred.resolve(data);
                    }).
                    error(function(data, status) {
                        deferred.reject('Unable to load sources');
                    });

                return deferred.promise;
            };*/
        });
    }).
        value('version', '0.0.1');

})();
