/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entityFactory', ['helper', 'platformer.entity'], function(helper, entity) {
  'use strict';

  var entities = [];

  function get(props) {
    return (entities.length > 0) ?
      entities.shift().init(props) :
      helper.clone(entity).init(props);
  }

  function free(entity) {
    entities.push(entity);
  }

  return {
    get: get,
    free: free
  };
});