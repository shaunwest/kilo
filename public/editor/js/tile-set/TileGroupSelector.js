/**
 * Created by shaun on 3/16/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dTilegroupselector', ['$log', function($log) {
      function controller($scope) {
        this.deselectAll = function() {
          angular.forEach($scope.tileSet.tileGroups, function(tileGroup) {
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
        scope: {
          tileSet: '='
        },
        restrict: 'AE',
        controller: controller,
        replace: true,
        templateUrl: '/editor/js/tile-set/tile-group-selector.html'
      };
    }]);
})();

