/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    angular.module('editor.controllers', []).
        controller('HomeCtrl', ['$scope', 'configLoader', 'sourcesList', 'gameId',
            function($scope, configLoader, sourcesList, gameId) {
                $scope.editorEnabled = false;

                $scope.sourcesWindow = {
                    open: function() {
                        sourcesList(gameId).then(function(data) {
                            $scope.remoteSources = data;
                            $scope.modal.center().open();
                        });
                    },
                    close: function() {
                        // close
                    }
                };

                $scope.addSource = function(source) {
                    var gameConfig = $scope.gameConfig,
                        sources = gameConfig.hasOwnProperty('sources') ? gameConfig['sources'] : {};

                    if(sources.hasOwnProperty(source)) {
                        console.log("Updated: " + source);
                    } else {
                        console.log("Added: " + source);
                    }

                    sources[source] = source;

                    gameConfig.sources = sources;
                };

                // Load up the game config file
                configLoader(gameId).then(function(config) {
                    $scope.gameConfig = config;
                    // Get tile sources
                    // Build level image from config...
                    $scope.editorEnabled = true;

                }, function(reason) {
                    console.log("ERROR: " + reason);

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

