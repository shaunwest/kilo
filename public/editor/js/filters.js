/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('editor.filters', []).
        filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]);
})();

