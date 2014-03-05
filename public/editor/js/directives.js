/**
 * Created by shaun on 1/22/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives', []).
    directive('appVersion', ['version', function(version) {
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
      function link(scope, element, attrs) {
        function onGroupAction(data) {
          switch(data.type) {
            case 'selectedTile':
              $log.debug(data.tileX + ', ' + data.tileY);
              break;
            case 'selectedGroup':
              $log.debug('group click');
              break;
          }
        }

        scope.onGroupAction = onGroupAction;
      }

      return {
        scope: {
          sources: '=sources'
        },
        restrict: 'AE',
        replace: true,
        link: link,
        templateUrl: '/editor/templates/tile-selector.html'
      };
    }])
    .directive('r2dTilegroup', ['$log', function($log) {
      function link(scope, element, attrs) {
        function borderClick(event) {
          var data = {
            type: "selectedGroup",
            groupId: scope.source
          };

          scope.onAction(data);
        }

        function imageClick(event) {
          //var index   = parseInt(angular.element(event.currentTarget).attr('index')),
          var offsetX = event.offsetX,
              offsetY = event.offsetY,
              data = {
                type: "selectedTile",
                groupId: scope.source,
                tileX: Math.floor(offsetX / 16),
                tileY: Math.floor(offsetY / 16)
              };

          scope.onAction(data);
          event.stopPropagation();
        }

        function mouseMove(event) {

        }

        function getImage(sourcePath) {
          var img = element.children('img:first-child');
          img.load(function() {
            element.width(img[0].width);
            element.height(img[0].height);
          });
          img.attr('src', sourcePath);
        }

        scope.sourcePath = '/ultradian/sources/' + scope.source;

        scope.imageClick = imageClick;
        scope.borderClick = borderClick;
        scope.mouseMove = mouseMove;

        getImage(scope.sourcePath);
      }

      return {
        scope: {
          index: '@index',
          source: '=source',
          onAction: '=onAction'
        },
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

