/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('editor.filters', [])
      /*.filter('interpolate', ['version', function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }])*/
      .filter('filterById', [function() {
        return function(id, list) {
          var i = 0,
            listLength = list.length;

          for(; i < listLength; i++) {
            if(list[i].id === id) {
              return list[i];
            }
          }
          return {};
        };
      }]);

})();

