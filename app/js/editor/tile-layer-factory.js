/**
 * Created by Shaun on 5/7/14.
 */

jack2d('editor.tileLayerFactory', ['editor.tileLayer', 'config', 'helper'], function(tileLayer, config, helper) {
  'use strict';

  function getTileLayer(tileSet, layerData) {
    return helper.clone(tileLayer).init(
      document.createElement('canvas'),
      tileSet,
      layerData,
      config.tileWidth, config.tileHeight
    );
  }

  return {
    getTileLayer: getTileLayer
  };
});