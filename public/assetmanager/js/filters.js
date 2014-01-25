/**
 * Created by shaun on 1/22/14.
 */
'use strict';

/* Filters */

angular.module('assetManager.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);