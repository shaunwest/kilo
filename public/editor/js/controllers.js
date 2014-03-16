/**
 * Created by shaun on 1/22/14.
 */

(function() {
  'use strict';

  angular.module('editor.controllers', [])
    .controller('SourcesCtrl', ['$scope', 'gameId', 'sourcesList', function($scope, gameId, sourcesList) {
      /*sourcesList(gameId).then(function(data) {
        console.log(data);
      });*/
    }])
    .controller('TilesCtrl', ['$routeParams', function($routeParams) {
    }]);
})();

