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
        var tileGroups = [];

        /*function init() {
          $scope.onGroupAction = onGroupAction;
        }*/

        function deselectAll() {
          /*element.children().each(function() {
            angular.element(this).attr('selected', 'false');
            $log.debug(angular.element(this).attr('selected'));
          });*/
          /*for(var i = 0; i < $scope.sources; i++) {
            $scope.sources[i].selected = false; /// BAH! IT DOESN'T WORK!
          }*/
          angular.forEach($scope.sources, function(source) {
            source.selected = false;
          });
        }

        this.addTileGroup = function(tileGroup) {
          tileGroups.push(tileGroup);
        };

        this.selectTileGroup = function(groupId) {
          $log.debug(groupId);
          deselectAll();
        };

        this.selectTile = function(groupId, tileX, tileY) {
          $log.debug(tileX + ', ' + tileY);
        };

        //init();
      }

      return {
        scope: {
          sources: '=sources'
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
          scope.sourcePath  = '/ultradian/sources/' + scope.source.source;

          scope.imageClick  = imageClick;
          scope.borderClick = borderClick;
          scope.mouseMove   = mouseMove;
          scope.mouseLeave  = mouseLeave;
          scope.mouseEnter  = mouseEnter;

          getImage(scope.sourcePath);

          tileSelectorCtrl.addTileGroup(scope);
          $log.debug(scope.selected);

          /*scope.$watch('selected', function(newVal, oldVal) {
            $log.debug('selected!');
            if(newVal === 'true') {
              setSelected(true);
            } else {
              setSelected(false);
            }
          });*/
          /*scope.$watch('source', function(newValue, oldValue) {
            setSelected(newValue.selected);
            $log.debug('TEST ' + oldValue.selected + ', ' + newValue.selected);
          });*/

          /*attrs.$observe('source', function(val) {
            $log.debug(val);
            setSelected(val.selected);
            $log.debug('TEST ' + val.selected);
          });*/
        }

        function setSelected(value) {
          if(value === true || typeof value === 'undefined') {
            //element.addClass('selected');
            scope.source.selected = true;
          } else {
            //element.removeClass('selected');
            scope.source.selected = false;
          }
        }

        function borderClick(event) {
          tileSelector.visible(false);


          tileSelectorCtrl.selectTileGroup(scope.source.source);

                    setSelected();
        }

        function imageClick(event) {
          tileSelector.setPosition(selector.x, selector.y);
          tileSelector.visible();

          setSelected(false);

          tileSelectorCtrl.selectTile(
            scope.source.source,
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
          source: '=source',
          onAction: '=onAction'
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

