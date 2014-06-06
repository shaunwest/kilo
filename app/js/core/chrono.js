/**
 * Created by Shaun on 5/31/14.
 */

jack2d('chrono', ['HashArray'], function(HashArray) {
  'use strict';

  var ONE_SECOND = 1000,
    targetFps,
    actualFps,
    ticks,
    running,
    elapsedSeconds,
    registeredCallbacks,
    lastRegisteredId,
    oneSecondTimerId,
    frameTimerId,
    lastUpdateTime,
    obj;

  function reset() {
    targetFps = 60;
    actualFps = 0;
    ticks = 0;
    elapsedSeconds = 0;
    lastRegisteredId = 0;
    registeredCallbacks = new HashArray();
    running = false;
    lastUpdateTime = new Date();
    return obj;
  }

  function register(callback) {
    var id = lastRegisteredId++;
    registeredCallbacks.add(id, callback);
    return id;
  }

  function unRegister(id) {
    registeredCallbacks.remove(id);
  }

  function requestNextFrame() {
    frameTimerId = window.requestAnimationFrame(onFrame);
  }

  function start() {
    if(!running && registeredCallbacks.items.length > 0) {
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
    var items = registeredCallbacks.items,
      numCallbacks = items.length,
      i;
    for(i = 0; i < numCallbacks; i++) {
      items[i](elapsed);
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
    register: register,
    unRegister: unRegister,
    getFps: function() { return actualFps; }
  };

  reset();

  return obj;
});