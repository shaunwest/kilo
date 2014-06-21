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
          if(helper.isFunction(this.spriteSheetReady)) {
            this.spriteSheetReady(this);
          }
        }), helper.call(this, function() {
          console.error('Jack2d: Error loading sprite sheet at \'' + spriteSheetPath + '\'');
        }));
      return this;
    },
    onSpriteSheetReady: function(callback) {
      this.spriteSheetReady = callback;
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
    // TODO: look into adding some caching to getFrame and getFrameSequence
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