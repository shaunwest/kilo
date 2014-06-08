/**
 * Created by Shaun on 5/31/14.
 */

jack2d('sprite',
['helper', 'spriteSheetParser', 'imageLoader'],
function(helper, spriteSheetParser, imageLoader) {
  'use strict';

  var DEFAULT_DELAY = 5;

  return {
    init: function(spriteSheetPath) {
      this.spriteSheetPath = spriteSheetPath;
      this.delay = DEFAULT_DELAY;
      imageLoader.loadPath(spriteSheetPath).
        then(helper.call(this, function(image) {
          this.spriteSheet = image;
          this.frameSet = spriteSheetParser.parse(image);
          this.frameSetReversed = spriteSheetParser.parse(image, true);
          this.readyCallback(this);
        }), helper.call(this, function() {
          console.error('Jack2D: Error loading sprite sheet at \'' + spriteSheetPath + '\'');
        }));
      return this;
    },
    ready: function(callback) {
      this.readyCallback = callback;
      return this;
    },
    refresh: function() {
      this.init(this.spriteSheetPath);
      return this;
    },
    getSpriteSheet: function() {
      return this.spriteSheet;
    },
    getFrameSet: function(reversed) {
      return (reversed) ? this.frameSetReversed : this.frameSet;
    },
    getDelay: function() {
      return this.delay;
    },
    getFrameSequence: function(frameSetIndex, reversed) {
      var frameSequence = this.getFrameSet(reversed)[frameSetIndex];
      if(frameSequence) {
        return frameSequence;
      }
      return null;
    },
    getFrame: function(frameSetIndex, frameIndex, reversed) {
      var frameSequence = this.getFrameSequence(frameSetIndex, reversed);
      if(frameSequence && frameSequence[frameIndex]) {
        return frameSequence[frameIndex];
      }
      return null;
    }
  };
});