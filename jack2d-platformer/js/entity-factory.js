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
    return (entities.length > 0) ?
      entities.shift().init() :
      helper.clone(helper.augment(props, entity)).init();
  }

  function free(entity) {
    entities.push(entity);
    return obj;
  }

  return obj;
});