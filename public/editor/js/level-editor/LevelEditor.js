/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives')
    .directive('r2dLeveleditor', [function() {
      function link(scope, element, attrs) {
      }

      return {
        scope: {
          enabled: '=',
          selected: '='
        },
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/js/level-editor/level-editor.html'
      };
    }]);
})();

