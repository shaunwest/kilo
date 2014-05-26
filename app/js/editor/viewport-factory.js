/**
 * Created by shaun on 4/23/14.
 */

jack2d('editor.viewportFactory',
['config', 'helper', 'editor.viewport'],
function(config, helper, viewport) {
  'use strict';

  function getViewport(container) {
    var canvas = document.createElement('canvas');

    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    canvas.style.position = 'absolute';
    container.appendChild(canvas);

    return helper.clone(viewport).init(canvas);
  }

  return {
    getViewport: getViewport
  };
});

