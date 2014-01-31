/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('interface.directives', []).
        directive('appVersion', ['version', function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
            };
        }])
        .directive('r2dLeveleditor', [function() {
            function link(scope, element, attrs) {
            }

            return {
                scope: {isEnabled: '&r2dEnabled'},
                restrict: 'E',
                replace: true,
                link: link,
                templateUrl: '/interface/templates/level-editor.html'
            };
        }]);
})();

