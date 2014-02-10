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
        .directive('r2dTileselector', [function() {
            function link(scope, element, attrs) {
            }

            return {
                scope: {},
                restrict: 'AE',
                replace: true,
                link: link,
                templateUrl: '/editor/templates/tile-selector.html'
            };
        }])
        .directive('r2dSourcesselector', [function() {
            function link(scope, element, attrs) {
            }
            return {
                scope: {sources: '=sources'},
                restrict: 'AE',
                replace: true,
                link: link,
                templateUrl: '/editor/templates/sources-selector.html'
            }
        }]);
})();

