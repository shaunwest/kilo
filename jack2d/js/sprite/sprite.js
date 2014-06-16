/**
 * Created by Shaun on 5/31/14.
 *
 * This is a Jack2d-specific sprite sheet format. Look at creating
 * a more generic sprite sheet handler
 */

jack2d('sprite',
['helper', 'spriteSheetParser', 'imageLoader'],
function(helper, spriteSheetParser, imageLoader) {
  'use strict';

  var DEFAULT_DELAY = 5;

  return {
    loadSpriteSheet: function(spriteSheetPath) {
      this.spriteSheetPath = spriteSheetPath;
      this.spriteSheetLoaded = false;
      this.delay = DEFAULT_DELAY;
      imageLoader.loadPath(spriteSheetPath).
        then(helper.call(this, function(image) {
          this.spriteSheet = image;
          this.frameSet = spriteSheetParser.parse(image);
          this.frameSetReversed = spriteSheetParser.parse(image, true);
          this.spriteSheetLoaded = true;
          this.readyCallback(this);
        }), helper.call(this, function() {
          console.error('Jack2D: Error loading sprite sheet at \'' + spriteSheetPath + '\'');
        }));
      return this;
    },
    spriteSheetReady: function(callback) {
      this.readyCallback = callback;
      return this;
    },
    refreshSpriteSheet: function() {
      this.loadSpriteSheet(this.spriteSheetPath);
      return this;
    },
    getSpriteSheet: function() {
      return this.spriteSheet;
    },
    getFrameSet: function(direction) {
      if(this.spriteSheetLoaded) {
        return (direction === 'right') ? this.frameSetReversed : this.frameSet;
      }
      return null;
    },
    getDelay: function() {
      return this.delay;
    },
    getFrameSequence: function(frameSetIndex, direction) {
      var frameSet = this.getFrameSet(direction);
      if(frameSet && frameSet[frameSetIndex]) {
        return frameSet[frameSetIndex];
      }
      return null;
    },
    getFrame: function(frameSetIndex, frameIndex, direction) {
      var frameSequence = this.getFrameSequence(frameSetIndex, direction);
      if(frameSequence && frameSequence[frameIndex]) {
        return frameSequence[frameIndex];
      }
      return null;
    }
  };
});