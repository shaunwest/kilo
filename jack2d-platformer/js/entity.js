/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['helper', 'platformer.physicsObject'], function(helper, physicsObject) {
  'use strict';

  return helper.mixin(physicsObject, {});
});
