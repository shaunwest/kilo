/**
 * Created by shaun on 1/22/14.
 */
(function() {
    'use strict';

    angular.module('assetManager', [
            'ngRoute',
            'assetManager.filters',
            'assetManager.services',
            'assetManager.directives',
            'assetManager.controllers'
        ]).
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/view1', {templateUrl: '/assetmanager/partials/partial1.html', controller: 'MyCtrl1'});
            $routeProvider.when('/view2', {templateUrl: '/assetmanager/partials/partial2.html', controller: 'MyCtrl2'});
            $routeProvider.otherwise({redirectTo: '/view1'});
        }]);
})();

