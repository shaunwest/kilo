/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('assetManager.directives', []).
        directive('appVersion', ['version', function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
            };
        }]);
})();

