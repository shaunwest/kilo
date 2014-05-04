/**
 * Created by shaun on 3/16/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dTilesetselector', ['configService', 'tileSetService',
      function(configService, tileSetService) {
        function link(scope, element, attrs) {
          scope.tileSets = [];
          tileSetService.getTileSets().then(function(tileSets) {
            angular.forEach(tileSets, function(tileSet) {
              scope.tileSets.push(tileSet);
              //scope.tileSets[tileSet.id] = tileSet;
            });
          });
        }

        return {
          scope: {
            selectedId: '='
          },
          restrict: 'AE',
          replace: true,
          link: link,
          templateUrl: '/editor/js/tiles/tile-set-selector.html'
        };
      }
    ]);
})();

