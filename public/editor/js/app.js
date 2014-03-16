/**
 * Created by shaun on 1/22/14.
 */

(function() {
  'use strict';

  angular.module('editor.directives', []);
  angular.module('editor.services', []);
  angular.module('editor.controllers', []);

  angular.module('editor', [
      'ngRoute',
      'kendo.directives',
      'editor.filters',
      'editor.services',
      'editor.directives',
      'editor.controllers'
    ])
    .value('gameId', 'ultradian')
    .config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        // Home
        $routeProvider.when('/', {
            templateUrl: '/editor/partials/home.html',
            controller: 'HomeCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: '/editor/partials/login.html',
            controller: 'LoginCtrl'
        });

        // Tiles
        $routeProvider.when('/tiles/sources', {
            templateUrl: '/editor/partials/tiles/sources.html',
            controller: 'TilesCtrl'
        });
        $routeProvider.when('/tiles/sets', {
            templateUrl: '/editor/partials/tiles/sets.html',
            controller: 'TilesCtrl'
        });
        $routeProvider.when('/tiles', {redirectTo: '/tiles/sets'});

        // Default
        $routeProvider.otherwise({redirectTo: '/'});
      }
    ]);
})();

