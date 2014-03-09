/**
 * Created by shaun on 1/22/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives', [])
    .directive('appVersion', ['version', function(version) {
      return function(scope, elm, attrs) {
        elm.text(version);
      };
    }])
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
    }])
    .directive('r2dTileselector', ['$log', function($log) {
      function controller($scope) {
        this.deselectAll = function() {
          angular.forEach($scope.tileGroups, function(source) {
            source.selected = false;
            source.tileSelected = false;
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
          tileGroups: '='
        },
        restrict: 'AE',
        controller: controller,
        replace: true,
        templateUrl: '/editor/templates/tile-selector.html'
      };
    }])
    .directive('r2dTilegroup', ['$log', 'selectorFactory', function($log, selectorFactory) {
      function link(scope, element, attrs, tileSelectorCtrl) {
        var selector      = selectorFactory(element.children('.selector')),
            tileSelector  = selectorFactory(element.children('.selectedItem'));

        getImage('/ultradian/sources/' + scope.tileGroup.source);

        function getImage(sourcePath) {
          var img = element.children('img:first-child');
          img.load(function() {
            element.width(img[0].width);
            element.height(img[0].height);
          });
          img.attr('src', sourcePath);
        }

        function setSelected(value) {
          if(value || typeof value === 'undefined') {
            tileSelectorCtrl.selectTileGroup(scope.tileGroup.source);
            scope.tileGroup.selected = true;
          } else {
            scope.tileGroup.selected = false;
          }
        }

        function selectTile(x, y) {
          tileSelectorCtrl.deselectAll();

          tileSelector.setPosition(x, y);
          scope.tileGroup.tileSelected = true;

          tileSelectorCtrl.selectTile(
            scope.tileGroup.source,
            Math.floor(x / 16),
            Math.floor(y / 16)
          );
        }

        function deselectTile() {
          scope.tileGroup.tileSelected = false;
        }

        /// Public Functions
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
          tileGroup: '='
        },
        require: '^r2dTileselector',
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/tile-group.html'
      }
    }])
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

