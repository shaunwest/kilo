/**
 * Created by Shaun on 5/7/14.
 */

jack2d('editor.tileLayerFactory',
['editor.tileLayer', 'appConfig', 'helper'],
function(tileLayer, appConfig, helper) {
  'use strict';

  return function(tileSet, layerData) {
    return helper.clone(tileLayer).init(
      document.createElement('canvas'),
      tileSet,
      layerData,
      appConfig.tileWidth, appConfig.tileHeight
    );
  };
});