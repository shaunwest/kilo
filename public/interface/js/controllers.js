/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('interface.controllers', []).
        controller('HomeCtrl', ['$scope', 'configLoader', 'gameId',
            function($scope, configLoader, gameId) {
                $scope.editorEnabled = false;

                configLoader(gameId).then(function(config) {
                    $scope.gameConfig = config;
                    // Build level image from config...
                    $scope.editorEnabled = true;

                }, function(reason) {
                    console.log(reason);
                    $scope.gameConfig = {};  // create a new empty game config
                    $scope.editorEnabled = true;
                });
            }
        ])
        .controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
            $scope.submit = function() {
                console.log("submit login form");
                $location.path('/');
            };
        }])
        .controller('TilesCtrl', ['$routeParams', function($routeParams) {
        }]);
})();

