/**
 * Created by shaun on 3/16/14.
 */

(function() {
  angular.module('editor.directives')
    .directive('r2dTilegroup', ['$log', 'configService', 'tileSetService', 'selectorFactory', function($log, configService, tileSetService, selectorFactory) {
      function link(scope, element, attrs, tileSelectorCtrl) {
        var selector = selectorFactory(element.children('.selector')),
          tileSelector = selectorFactory(element.children('.selectedItem'));

        tileSetService.getTileGroup(scope.tileSetId, scope.tileGroupId).then(function(tileGroup) {
          scope.tileGroup = tileGroup;
          scope.tileGroup.getImage().then(function(image) {
            scope.image = image;
          });
        });

        function setSelected(value) {
          if(value || typeof value === 'undefined') {
            tileSelectorCtrl.selectTileGroup(scope.tileGroup.id);
            scope.tileGroup.groupSelected = true;
          } else {
            scope.tileGroup.groupSelected = false;
          }
        }

        function selectTile(x, y) {
          tileSelectorCtrl.deselectAll();

          tileSelector.setPosition(x, y);
          scope.tileGroup.tileSelected = true;

          tileSelectorCtrl.selectTile(
            scope.tileGroup.id,
            Math.floor(x / 16),
            Math.floor(y / 16)
          );
        }

        function deselectTile() {
          scope.tileGroup.tileSelected = false;
        }

        scope.borderClick = function(event) {
          deselectTile();
          setSelected(true);
        };

        scope.imageClick = function(event) {
          selectTile(selector.x, selector.y);
          setSelected(false);

          event.stopPropagation();
        };

        scope.mouseMove = function(event) {
          var offsetX = Math.floor(event.offsetX / 16) * 16,
            offsetY = Math.floor(event.offsetY / 16) * 16;

          selector.setPosition(offsetX, offsetY);
        };

        scope.mouseLeave = function(event) {
          scope.highlighterVisible = false;
        };

        scope.mouseEnter = function(event) {
          scope.highlighterVisible = true;
        };
      }

      return {
        scope: {
          tileSetId: '=',
          tileGroupId: '='
        },
        require: '^r2dTilegroupselector',
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/js/tiles/tile-group.html'
      }
    }]);
})();

