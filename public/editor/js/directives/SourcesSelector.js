/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives')
    .directive('r2dSourcesselector', [function() {
      function link(scope, element, attrs) {
      }
      return {
        scope: {sources: '=sources', onAddSource: '=onAddSource'},
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/sources-selector.html'
      }
    }]);
})();

