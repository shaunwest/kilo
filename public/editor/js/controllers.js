/**
 * Created by shaun on 1/22/14.
 */

(function() {
  'use strict';

  angular.module('editor.controllers', []).
    controller('HomeCtrl', ['$scope', 'configLoader', 'sourcesList', 'gameId',
      function($scope, configLoader, sourcesList, gameId) {
        function addSource(source) {
          var gameConfig  = $scope.gameConfig,
              sources     = gameConfig.hasOwnProperty('sources') ? gameConfig['sources'] : {};

          if(sources.hasOwnProperty(source)) {
            console.log("Updated: " + source);
          } else {
            console.log("Added: " + source);
          }

          sources[source] = source;
          gameConfig.sources = sources;
        }

        function loadTileSet(tileSet) {
          var sources     = tileSet.sources,
              sourceCount = sources.length,
              tileGroups  = [],
              i           = 0;

          for(; i < sourceCount; i++) {
            assetProcessor.tileConverter.makeTileGroup(sources[i], function(tileGroup) {
              tileGroups.push(tileGroup);
            });
          }

          // TODO: name this var something else
          //$scope.tileGroups = tileGroups;
        }

        // Load up the game config file
        configLoader(gameId).then(
          function(config) {
            var sources = config.tileSets[0].sources;

            $scope.gameConfig = config;

            //loadTileSet(config.tileSets[0]);

            $scope.tileGroups = [];
            for(var i = 0; i < sources.length; i++) {
              $scope.tileGroups.push({
                source: sources[i],
                tileSelected: false,
                selected: false
              });
            }

            // Get tile sources
            // Convert to tile selectors
            // Build level image from config...
            $scope.editorEnabled = true;

          },
          function(reason) {
            console.log("ERROR: " + reason);

            $scope.gameConfig = {};  // create a new empty game config
            $scope.editorEnabled = true;
          }
        );

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

        $scope.editorEnabled = false;
        $scope.addSource = addSource;
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

