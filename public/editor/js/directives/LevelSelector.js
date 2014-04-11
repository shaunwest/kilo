/**
 * Created by shaun on 3/26/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dLevelselector', [function() {
      function link(scope, element, attrs) {
        scope.log = function(msg) { console.log(msg) };
      }

      return {
        scope: {
          selected: '=',
          levels: '='
        },
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/level-selector.html'
      };
    }]);
})();
