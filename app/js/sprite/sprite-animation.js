/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimation', ['helper', 'chrono'], function(helper, chrono) {
  'use strict';

  return {
    init: function(sprite) {
      this.sprite = sprite;
      this.reversed = false;
      this.frameSetIndex = -1;
      this.frameSpeedMult = 62.5; // FIXME
      this.onSequenceComplete = null;
      this.onAnimationChange = null;
      this.onFrameComplete = null;
      this.stop();
      if(!this.chronoId) {
        this.chronoId = chrono.register(helper.call(this, this.update));
      }
      return this;
    },

    sequenceDone: function(callback) {
      this.onSequenceComplete = callback;
      return this;
    },

    frameDone: function(callback) {
      this.onFrameComplete = callback;
      return this;
    },

    sequenceChange: function(callback) {
      this.onAnimationChange = callback;
      return this;
    },

    update: function(secondsElapsed) {
      if(!this.playing) {
        return;
      }

      if(this.currentStep >= this.sprite.getDelay()) {
        this.processFrame();
        this.currentStep = 0;
      } else {
        this.currentStep += (secondsElapsed * this.frameSpeedMult);
      }
    },

    processFrame: function() {
      if(this.onFrameComplete) {
        this.onFrameComplete(this.sequenceIndex);
      }

      if(++this.sequenceIndex >= this.sprite.getFrameSequence(this.frameSetIndex).length) {
        this.sequenceIndex = this.startFrame;
        if(this.onSequenceComplete) {
          this.onSequenceComplete();
        }

        if(this.stopOnComplete) {
          this.stop();
        }
      }
    },

    playSequence: function(frameSetIndex, reversed) {
      chrono.start();
      this.reversed = reversed;
      if(frameSetIndex !== this.frameSetIndex) {
        this.frameSetIndex = frameSetIndex;
        this.stop();

        if(this.onAnimationChange) {
          this.onAnimationChange(frameSetIndex);
        }
      }
      this.playing = true;
      return this;
    },

    play: function(reversed) {
      this.playSequence(this.frameSetIndex, reversed || this.reversed);
      return this;
    },

    playOnce: function(reversed) {
      this.play(reversed);
      this.stopOnComplete = true;
      return this;
    },

    stop: function() {
      this.playing = false;
      this.startFrame = 0;
      this.stopOnComplete = false;
      this.sequenceIndex = 0;
      this.currentStep = 0.0;
      return this;
    },

    pause: function() {
      this.playing = false;
      return this;
    },

    unPause: function() {
      this.playing = true;
      return this;
    },

    setFrame: function(frameIndex) {
      this.sequenceIndex = frameIndex;
      return this;
    },

    getCurrentFrame: function() {
      return this.sprite.getFrame(this.frameSetIndex, this.sequenceIndex, this.reversed);
    }
  };
});