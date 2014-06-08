/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteFactory', ['helper', 'sprite'], function(helper, sprite) {
  'use strict';

  return function(tileSheetPath) {
    return helper.clone(sprite).init(tileSheetPath);
  };
});