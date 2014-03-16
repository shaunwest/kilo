/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('tileGroups', [function() {
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
})();

