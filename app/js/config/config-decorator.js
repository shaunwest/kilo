/**
 * Created by Shaun on 5/26/14.
 */

jack2d('configDecorator', ['helper'], function(helper) {
  'use strict';

  return function (config) {
    function getById(array, id) {
      if(!helper.isArray(array)) {
        return null;
      }
      for(var i = 0; i < array.length; i++) {
        if(array[i].id === id) {
          return array[i];
        }
      }
      return null;
    }

    function getByIndex(array, index) {
      if(!helper.isArray(array)) {
        return null;
      }
      if(index < 0 || index >= array.length) {
        return null;
      }

      return array[index];
    }

    function getLevel(levelId) {
      return getById(config.levels, levelId);
    }

    function getLayer(levelId, layerIndex) {
      var level = getLevel(levelId);
      if(level) {
        var layer = getByIndex(level.layers, layerIndex);
        if(layer) {
          return layer;
          /*return helper.augment(layer, { //FIXME: this set tile method should be in tileSet
            setTile: function(tileX, tileY, tileGroupId, tileIndex) {
              layer.data[tileY][tileX] = [tileGroupId, tileIndex];
            }
          });*/
        }
      }
      return null;
    }

    function getTileSets() {
      return (config.tileSets) ? config.tileSets : null;
    }

    function getTileSet(tileSetId) {
      var tileSets = getTileSets();
      return getById(tileSets, tileSetId);
    }

    function getSources(tileSetId) {
      var tileSet = getTileSet(tileSetId);
      if(tileSet && tileSet.sources) {
        return tileSet.sources;
      }
      return null;
    }

    return {
      config: config,
      getTileSets: getTileSets,
      getTileSet: getTileSet,
      getLevel: getLevel,
      getLayer: getLayer,
      getSources: getSources
    };
  };

});