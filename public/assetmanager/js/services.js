/**
 * Created by shaun on 1/22/14.
 */

(function() {
    'use strict';

    // Demonstrate how to register services
    // In this case it is a simple value service.
    angular.module('assetManager.services', []).
        value('version', '0.1');
})();
