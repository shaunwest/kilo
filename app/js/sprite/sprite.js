/**
 * Created by Shaun on 5/31/14.
 */

jack2d('sprite', ['spriteSheetParser', 'imageLoader'], function(spriteSheetParser, imageLoader) {
  'use strict';

  var DEFAULT_DELAY = 5;

  return {
    init: function(spriteSheetPath) {
      var self = this;
      this.spriteSheetPath = spriteSheetPath;
      this.delay = DEFAULT_DELAY;
      imageLoader.loadPath(spriteSheetPath).
        then(function(image) {
          self.spriteSheet = image;
          self.frameSet = spriteSheetParser.parse(image);
          self.frameSetReversed = spriteSheetParser.parse(image, true);
          self.readyCallback(self);
        }, function() {
          console.log('Jack2D: Error loading sprite sheet at \'' + spriteSheetPath + '\'');
        });
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