/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteFactory', ['obj', 'sprite'], function(obj, sprite) {
  'use strict';

  return function(tileSheetPath) {
    return obj.clone(sprite).loadSpriteSheet(tileSheetPath);
  };
});