/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['obj', 'platformer.PhysicsObject'], function(obj, PhysicsObject) {
  'use strict';

  return obj.mixin(PhysicsObject);
});
