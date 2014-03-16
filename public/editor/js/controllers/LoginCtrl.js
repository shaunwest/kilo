/**
 * Created by shaun on 3/16/14.
 */

(function() {
  'use strict';

  angular.module('editor.controllers')
    .controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.submit = function() {
        console.log("submit login form");
        $location.path('/');
      };
    }]);
})();

