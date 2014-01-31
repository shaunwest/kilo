/**
 * Created by shaun on 1/22/14.
 */
(function() {
    'use strict';

    angular.module('interface', [
            'ngRoute',
            'interface.filters',
            'interface.services',
            'interface.directives',
            'interface.controllers'
        ]).
        value('gameId', 'ultradian').
        config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
                $locationProvider.html5Mode(true);
                $locationProvider.hashPrefix('!');

                // Home
                $routeProvider.when('/', {
                    templateUrl: '/interface/partials/home.html',
                    controller: 'HomeCtrl'
                });

                $routeProvider.when('/login', {
                    templateUrl: '/interface/partials/login.html',
                    controller: 'LoginCtrl'
                });

                // Tiles
                $routeProvider.when('/tiles/sources', {
                    templateUrl: '/interface/partials/tiles/sources.html',
                    controller: 'TilesCtrl'
                });
                $routeProvider.when('/tiles/sets', {
                    templateUrl: '/interface/partials/tiles/sets.html',
                    controller: 'TilesCtrl'
                });
                $routeProvider.when('/tiles', {redirectTo: '/tiles/sets'});

                // Default
                $routeProvider.otherwise({redirectTo: '/'});
            }]);
})();

