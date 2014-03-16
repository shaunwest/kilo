/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.services')
    .factory('sourcesList', function(resourceLoader) {
      return function(appId) {
        return resourceLoader('/' + appId + '/sources/demo1');
      };
    });
})();

