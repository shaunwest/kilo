/**
 * Created by shaun on 3/16/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dTilesetselector', [function() {
      return {
        scope: {
          selected: '=',
          tileSets: '='
        },
        restrict: 'AE',
        replace: true,
        templateUrl: '/editor/js/tile-set/tile-set-selector.html'
      };
    }]);
})();

