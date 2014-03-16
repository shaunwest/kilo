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
        scope: {isEnabled: '=enabled'},
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/level-editor.html'
      };
    }]);
})();

