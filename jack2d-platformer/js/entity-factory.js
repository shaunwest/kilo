/**
 * Created by Shaun on 6/4/14.
 */

// TODO: create a generic object pool module
jack2d('platformer.entityFactory', ['obj', 'platformer.entity'], function(obj, entity) {
  'use strict';

  var entities = [],
  publicMethods = {
    get: get,
    free: free
  };

  function get() {
    var newEntity = obj.clone(unCache() || entity);
    newEntity.x = 0;
    newEntity.y = 0;
    return newEntity.init();
  }

  function unCache() {
    if(entities.length > 0) {
      return entities.shift().init();
    }
    return null;
  }

  function free(entity) {
    entities.push(entity);
    return publicMethods;
  }

  return publicMethods;
});