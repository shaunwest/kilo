/**
 * Created by Shaun on 5/31/14.
 */

jack2d('spriteAnimation', ['helper', 'obj', 'chrono'], function(helper, obj, chrono) {
  'use strict';

  return obj.mixin(['chronoObject', 'sprite'], {
    initAnimation: function() {
      this.direction = 'left';
      this.frameSetIndex = -1;
      this.animationReady = true;
      this.stop();
      this.onFrame(function(deltaSeconds) {
        if(!this.spriteSheetLoaded || !this.playing) {
          return;
        }

        if(this.currentStep === 0) {
          this.processFrame();
        }

        if(this.currentStep >= this.getDelay()) {
          this.currentStep = 0;
        } else {
          this.currentStep += (deltaSeconds * chrono.getWholeMultiplier());
        }
      });
      return this;
    },

    resetAnimation: function() {
      this.onSequenceComplete = null;
      this.onAnimationChange = null;
      this.onFrameComplete = null;
      this.initAnimation();
      return this;
    },

    onSequenceDone: function(callback) {
      this.onSequenceComplete = callback;
      return this;
    },

    onAnimationFrame: function(callback) {
      this.onFrameComplete = callback;
      return this;
    },

    onSequenceChange: function(callback) {
      this.onAnimationChange = callback;
      return this;
    },

    processFrame: function() {
      if(this.onFrameComplete) {
        this.onFrameComplete(this.sequenceIndex);
      }

      if(++this.sequenceIndex >= this.getFrameSequence(this.frameSetIndex).length) {
        this.sequenceIndex = this.startFrame;
        if(this.onSequenceComplete) {
          this.onSequenceComplete();
        }

        if(this.stopOnComplete) {
          this.stop();
        }
      }
    },

    playSequence: function(frameSetIndex, direction) {
      if(!this.animationReady) {
        this.initAnimation();
      }
      if(!helper.isDefined(direction)) {
        direction = this.direction;
      }
      if(frameSetIndex !== this.frameSetIndex || this.direction !== direction) {
        this.direction = direction;
        this.frameSetIndex = frameSetIndex;
        this.stop();

        if(this.onAnimationChange) {
          this.onAnimationChange(frameSetIndex);
        }
      }
      this.playing = true;
      return this;
    },

    play: function(direction) {
      this.playSequence(this.frameSetIndex, direction || this.direction);
      return this;
    },

    playOnce: function(direction) {
      this.play(direction);
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
      return this.getFrame(this.frameSetIndex, this.sequenceIndex, this.direction);
    }
  });
});