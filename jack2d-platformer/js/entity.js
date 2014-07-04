/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['obj', 'platformer.physicsObject'], function(obj, physicsObject) {
  'use strict';

  return obj.mixin(physicsObject, {});
});
