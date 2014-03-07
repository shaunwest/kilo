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
        function deselectAll() {
          angular.forEach($scope.tileGroups, function(source) {
            source.selected = false;
          });
        }

        this.selectTileGroup = function(groupId) {
          $log.debug(groupId);
          deselectAll();
        };

        this.selectTile = function(groupId, tileX, tileY) {
          $log.debug(tileX + ', ' + tileY);
        };
      }

      return {
        scope: {
          tileGroups: '=tileGroups'
        },
        restrict: 'AE',
        controller: controller,
        replace: true,
        templateUrl: '/editor/templates/tile-selector.html'
      };
    }])
    .directive('r2dTilegroup', ['$log', function($log) {
      function link(scope, element, attrs, tileSelectorCtrl) {
        var selector      = createSelector(element.children('.selector')),
            tileSelector  = createSelector(element.children('.selectedItem'));

        function createSelector(el) {
          return {
            el: el,
            x: 0,
            y: 0,
            setPosition: function(x, y) {
              this.x = x;
              this.y = y;
              this.el.css({left: x, top: y});
            },
            toggle: function() {
              this.el.toggle();
            },
            visible: function(value) {
              (value || typeof value === 'undefined')
                ? this.el.show() : this.el.hide();
            }
          };
        }

        function init() {
          scope.sourcePath  = '/ultradian/sources/' + scope.tileGroup.source;

          scope.imageClick  = imageClick;
          scope.borderClick = borderClick;
          scope.mouseMove   = mouseMove;
          scope.mouseLeave  = mouseLeave;
          scope.mouseEnter  = mouseEnter;

          getImage(scope.sourcePath);
        }

        function setSelected(value) {
          scope.tileGroup.selected = !!((value === true || typeof value === 'undefined'));
        }

        function borderClick(event) {
          tileSelector.visible(false);

          tileSelectorCtrl.selectTileGroup(scope.tileGroup.source);

          setSelected();
        }

        function imageClick(event) {
          tileSelector.setPosition(selector.x, selector.y);
          tileSelector.visible();

          setSelected(false);

          tileSelectorCtrl.selectTile(
            scope.tileGroup.source,
            Math.floor(selector.x / 16),
            Math.floor(selector.y / 16)
          );

          event.stopPropagation();
        }

        function mouseMove(event) {
          var offsetX = Math.floor(event.offsetX / 16) * 16,
              offsetY = Math.floor(event.offsetY / 16) * 16;

          selector.setPosition(offsetX, offsetY);
        }

        function mouseLeave(event) {
          selector.toggle();
        }

        function mouseEnter(event) {
          selector.toggle();
        }

        function getImage(sourcePath) {
          var img = element.children('img:first-child');
          img.load(function() {
            element.width(img[0].width);
            element.height(img[0].height);
          });
          img.attr('src', sourcePath);
        }

        init();
      }

      return {
        scope: {
          tileGroup: '=tileGroup'
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

