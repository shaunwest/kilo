/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('editor.controllers', []).
        controller('HomeCtrl', ['$scope', 'configLoader', 'sourcesList', 'gameId',
            function($scope, configLoader, sourcesList, gameId) {
                $scope.editorEnabled = false;

                /*$scope.sources = {
                    data: [
                        { filename: "Thing 1" },
                        { filename: "Thing 2" },
                        { filename: "Thing 3" }
                    ]
                };*/

                $scope.sourcesWindow = {
                    open: function() {
                        sourcesList(gameId).then(function(data) {
                            $scope.sources = data;
                        });
                        $scope.modal.center().open();
                    }
                };

                configLoader(gameId).then(function(config) {
                    $scope.gameConfig = config;
                    // Get tile sources
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
        .controller('SourcesCtrl', ['$scope', 'gameId', 'sourcesList', function($scope, gameId, sourcesList) {
            /*sourcesList(gameId).then(function(data) {
                console.log(data);
            });*/
        }])
        .controller('TilesCtrl', ['$routeParams', function($routeParams) {
        }]);
})();

