/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives')
    .directive('r2dTilegroupselector', ['$log', 'tileSetService', function($log, tileSetService) {
      function controller($scope) {
        $scope.tileGroups = [];

        tileSetService.getTileSet(1).then(function(tileSet) {
          $scope.tileSet = tileSet;
          angular.forEach(tileSet.tileGroups, function(tileGroup) {
            $scope.tileGroups.push(tileGroup);
          });
          //$scope.tileSet = tileSet;
        });

        this.deselectAll = function() {
          angular.forEach($scope.tileGroups, function(tileGroup) {
            tileGroup.groupSelected = false;
            tileGroup.tileSelected = false;
          });
        };

        this.selectTileGroup = function(groupId) {
          $log.debug(groupId);
          this.deselectAll();
        };

        this.selectTile = function(groupId, tileX, tileY) {
          $log.debug(tileX + ', ' + tileY);
        };
      }

      return {
        scope: {},
        restrict: 'AE',
        controller: controller,
        replace: true,
        templateUrl: '/editor/js/tiles/tile-group-selector.html'
      };
    }]);
})();

