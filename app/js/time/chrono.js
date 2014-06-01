/**
 * Created by Shaun on 5/31/14.
 */

jack2d('chrono', [], function() {
  'use strict';

  var ONE_SECOND = 1000,
    targetFps,
    actualFps,
    ticks,
    running,
    elapsedSeconds,
    frameCallbacks,
    oneSecondTimerId,
    frameTimerId,
    lastUpdateTime,
    obj;

  function reset() {
    targetFps = 60;
    actualFps = 0;
    ticks = 0;
    elapsedSeconds = 0;
    frameCallbacks = [];
    running = false;
    lastUpdateTime = new Date();
    return obj;
  }

  function frame(callback) {
    frameCallbacks.push(callback);
    return obj;
  }

  function removeFrameCallback(callback) {
    var numCallbacks = frameCallbacks.length,
      i;

    for(i = 0; i < numCallbacks; i++) {
      if(frameCallbacks[i] === callback) {
        frameCallbacks.splice(i, 1);
        return obj;
      }
    }

    return obj;
  }

  function requestNextFrame() {
    frameTimerId = window.requestAnimationFrame(onFrame);
  }

  function start() {
    if(!running && frameCallbacks.length > 0) {
      running = true;
      oneSecondTimerId = window.setInterval(onOneSecond, ONE_SECOND);
      onFrame();
    }
    return obj;
  }

  function stop() {
    running = false;
    window.clearInterval(oneSecondTimerId);
    window.cancelAnimationFrame(frameTimerId);
    return obj;
  }

  function onFrame() {
    executeFrameCallbacks(getElapsedTime());
    tick();

    if(running) {
      requestNextFrame();
    }
  }

  function executeFrameCallbacks(elapsed) {
    var i, numCallbacks = frameCallbacks.length;
    for(i = 0; i < numCallbacks; i++) {
      frameCallbacks[i](elapsed);
    }
  }

  function getElapsedTime() {
    var now = +new Date(),
      elapsed = (now - lastUpdateTime) / ONE_SECOND;

    lastUpdateTime = now;

    return elapsed;
  }

  function tick() {
    ticks++;
  }

  function onOneSecond() {
    actualFps = ticks.toString();
    ticks = 0;
    elapsedSeconds++;
  }

  obj = {
    reset: reset,
    start: start,
    stop: stop,
    frame: frame,
    removeFrameCallback: removeFrameCallback,
    getFps: function() { return actualFps; }
  };

  reset();

  return obj;
});