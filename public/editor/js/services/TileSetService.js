/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('tileSetService', ['$q', '$filter', '$log', 'imageService', 'configService',
      function($q, $filter, $log, imageService, configService) {
        var tileSets = null;

        function createImage(path) {
          var image = document.createElement('img');
          image.src = '/ultradian/sources/' + path;

          return imageService.ready(image);
        }

        function createTileGroup(tileGroups, source) {
          return {
            id: source.id,
            getImage: function() { return createImage(source.path); },
            //data: assetProcessor.tileConverter.makeTiles(image),
            tileSelected: false,
            groupSelected: false
          };
        }

        function createTileGroups(sources) {
          var tileGroups = {},
            sourcesCount = sources.length,
            i = 0;

          for(; i < sourcesCount; i++) {
            tileGroups[sources[i].id] = createTileGroup(tileGroups, sources[i]);
          }

          return tileGroups;
        }

        function createTileSet(tileSetConfig) {
          return {
            id: tileSetConfig.id,
            name: tileSetConfig.name,
            tileGroups: createTileGroups(tileSetConfig.sources)
          };
        }

        function getTileSets() {
          var deferred = $q.defer();

          if(tileSets) {
            deferred.resolve(tileSets);
          } else {
            configService.getConfig().then(function(config) {
              tileSets = {};
              angular.forEach(config.tileSets, function(tileSetConfig) {
                var tileSet = createTileSet(tileSetConfig);
                tileSets[tileSet.id] = tileSet;
              });
              deferred.resolve(tileSets);
            });
          }

          return deferred.promise;
        }

        function getTileSet(tileSetId) {
          return getTileSets().then(function(tileSets) {
            return tileSets[tileSetId];
          });
        }

        function getTileGroup(tileSetId, tileGroupId) {
          return getTileSet(tileSetId).then(function(tileSet) {
            return tileSet.tileGroups[tileGroupId];
          });
        }

        return {
          getTileSet: getTileSet,
          getTileSets: getTileSets,
          getTileGroup: getTileGroup
        };
      }
    ]);
})();

