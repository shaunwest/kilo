/**
 * Created by Shaun on 5/31/14.
 *
 * This is a Jack2d-specific sprite sheet format. Look at creating
 * a more generic sprite sheet handler
 */

jack2d('sprite',
['helper', 'spriteSheetParser', 'imageLoader', 'FrameSet', 'Requires'],
function(helper, spriteSheetParser, imageLoader, FrameSet, Requires) {
  'use strict';

  var DEFAULT_DELAY = 5,
    DEFAULT_WIDTH = 48,
    DEFAULT_HEIGHT = 48;

  return {
    loadSpriteSheet: function(spriteSheetPath) {
      this.spriteSheetPath = spriteSheetPath;
      this.spriteSheetLoaded = false;
      this.spriteFrameDelay = DEFAULT_DELAY;
      imageLoader.loadPath(spriteSheetPath).
        then(helper.call(this, function(image) {
          this.spriteSheet = image;
          this.frameSet = new FrameSet(spriteSheetParser.parse(image), DEFAULT_WIDTH, DEFAULT_HEIGHT);
          //this.frameSetReversed = spriteSheetParser.parse(image, true);
          //this.spriteSheetLoaded = true;
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
    getFrameSet: function(flipped) {
      if(this.spriteSheetLoaded) {
        //return (direction === 'right') ? this.frameSetReversed : this.frameSet;
        return this.frameSet.getFrames(flipped);
      }
      return null;
    },
    setDelay: function(value) {
      this.spriteFrameDelay = value;
      return this;
    },
    getDelay: function() {
      return this.spriteFrameDelay;
    },
    // TODO: look into adding some caching to getFrame and getFrameSequence
    getFrameSequence: Requires(['frameSet'], function(frameSetIndex, direction) {
      //var frameSet = this.getFrameSet(direction);
      var frameSet = this.frameSet.getFrames(direction);
      if(frameSet && frameSet[frameSetIndex]) {
        return frameSet[frameSetIndex];
      }
      return null;
    }),
    getFrame: function(frameSetIndex, frameIndex, direction) {
      var frameSequence = this.getFrameSequence(frameSetIndex, direction);
      if(frameSequence && frameSequence[frameIndex]) {
        return frameSequence[frameIndex];
      }
      return null;
    }
  };
});