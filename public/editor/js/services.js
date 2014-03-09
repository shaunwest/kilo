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

        $http({method: 'GET', url: appId + '/config'}).
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
        return resourceLoader('/' + appId + '/sources/demo1');
      };
    });

    $provide.factory('selectorFactory', function() {
      return function(el) {
        return {
          el: el,
          x: 0,
          y: 0,
          setPosition: function(x, y) {
            this.x = x;
            this.y = y;
            this.el.css({left: x, top: y});
          },
          toggle: function() {
            this.el.toggle();
          },
          visible: function(value) {
            (value || typeof value === 'undefined')
              ? this.el.show() : this.el.hide();
          }
        };
      };
    });
  }).
    value('version', '0.0.1');

})();
