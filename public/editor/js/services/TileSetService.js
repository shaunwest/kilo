/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('tileSetService', ['$q', function($q) {
      var tileSets = null;

      function load(tileSetsData) {
        var tileSetCount = tileSetsData.length,
          i = 0;

        tileSets = [];

        for(; i < tileSetCount; i++) {
          tileSets.push(loadTileSet(tileSetsData[i]));
        }

        return tileSets;
      }

      function loadTileSet(tileSetData) {
        var setName     = tileSetData.name,
          setId       = tileSetData.id,
          sourcesData = tileSetData.sources,
          sourceCount = sourcesData.length,
          tileSet = {
            id: setId,
            name: setName,
            tileGroups: []
          },
          i = 0;

        for(; i < sourceCount; i++) {
          loadTileGroup(sourcesData[i].id, '/ultradian/sources/' + sourcesData[i].path).then(function(tileGroup) {
            tileSet.tileGroups.push(tileGroup);
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

      /*function addSource(sourceId, sourcePath) {
       tileSets
       }*/

      return {
        load: load,
        getTileSets: function() { return tileSets; }
      };
    }]);
})();

