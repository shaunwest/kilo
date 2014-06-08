/**
 * Created by shaun on 4/23/14.
 */

jack2d('editor.viewportFactory',
['appConfig', 'helper', 'editor.viewport'],
function(appConfig, helper, viewport) {
  'use strict';

  return function(container) {
    var canvas = document.createElement('canvas');

    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    canvas.style.position = 'absolute';
    container.appendChild(canvas);

    return helper.clone(viewport).init(canvas);
  };
});

