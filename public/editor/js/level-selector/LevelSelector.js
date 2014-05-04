/**
 * Created by shaun on 3/26/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dLevelselector', ['configService', function(configService) {
      function link(scope, element, attrs) {
        configService.getConfig().then(function(config) {
          scope.levels = config.levels;
        });
      }

      return {
        scope: {
          selectedId: '='
        },
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/js/level-selector/level-selector.html'
      };
    }]);
})();
