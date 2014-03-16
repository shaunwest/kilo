/**
 * Created by shaun on 3/16/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dTilegroupselector', ['$log', function($log) {
      function link(scope, element, attrs) {
      }

      return {
        scope: {
          selected: '=',
          tileSets: '='
        },
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/tile-group-selector.html'
      };
    }]);
})();

