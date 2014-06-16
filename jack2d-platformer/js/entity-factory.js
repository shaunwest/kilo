/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entityFactory', ['helper', 'platformer.entity'], function(helper, entity) {
  'use strict';

  var entities = [],
  obj = {
    get: get,
    free: free
  };

  function get(props) {
    return helper.clone(helper.mixin(props, unCache() || entity)).doPhysics();
  }

  function unCache() {
    if(entities.length > 0) {
      return entities.shift().doPhysics();
    }
    return null;
  }

  function free(entity) {
    entities.push(entity);
    return obj;
  }

  return obj;
});