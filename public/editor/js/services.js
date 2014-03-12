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

    $provide.factory('tileSetService', ['$q', function($q) {
      var tileSets = null;

      function load(tileSetsData) {
        var i = 0,
            tileSetCount = tileSetsData.length;

        tileSets = [];

        for(; i < tileSetCount; i++) {
          tileSets.push(loadTileSet(tileSetsData[i]));
        }

        return tileSets;
      }

      function loadTileSet(tileSetData) {
        var tileSet = [],
            sourcesData = tileSetData.sources,
            sourceCount = sourcesData.length,
            i = 0;

        for(; i < sourceCount; i++) {
          loadTileGroup(sourcesData[i].id, '/ultradian/sources/' + sourcesData[i].path).then(function(tileGroup) {
            tileSet.push(tileGroup);
          });
        }

        return tileSet;
      }

      function loadTileGroup(sourceId, sourcePath) {
        var deferred = $q.defer(),
            img = document.createElement('img');

        img.onload = function() {
          deferred.resolve({
            id: sourceId,
            image: img,
            data: assetProcessor.tileConverter.makeTiles(img),
            tileSelected: false,
            groupSelected: false
          });
        };
        img.src = sourcePath;

        return deferred.promise;
      }

      return {
        load: load,
        getTileSets: function() { return tileSets; }
      };
    }]);

    $provide.factory('tileGroups', [function() {
      var tileGroups = null;

      function load(sources) {
        var i = 0;

        tileGroups = [];

        for(; i < sources.length; i++) {
          getImage('/ultradian/sources/' + sources[i]);
        }
      }

      function getImage(sourcePath) {
        var img = document.createElement('img');
        img.onload(function() {
          tileGroups.push({
            image: img,
            data: assetProcessor.tileConverter.makeTiles(img)
          });
        });
        img.src = sourcePath;
      }

      return {
        load: load
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
          }
        };
      };
    });
  }).
    value('version', '0.0.1');

})();
