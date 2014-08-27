/**
 * Created by shaun on 3/1/14.
 */

jack2d('spriteSheetParser', ['appConfig'], function(appConfig) {
  'use strict';

  var DEFAULT_SPRITE_HEIGHT = 48,
    DEFAULT_SPRITE_WIDTH = 48;

  function parse(image, flip) {
    var spriteHeight = appConfig.spriteHeight || DEFAULT_SPRITE_HEIGHT,
      rowCount = Math.floor(image.height / spriteHeight),
      data = [],
      i;

    for(i = 0; i < rowCount; i++) {
      data.push(addRow(image, i, flip));
    }

    return data;
  }

  function addRow(sourceAsset, row, flip) {
    var spriteWidth = appConfig.spriteWidth || DEFAULT_SPRITE_WIDTH,
      spriteHeight = appConfig.spriteHeight || DEFAULT_SPRITE_HEIGHT,
      spriteCount = Math.floor(sourceAsset.width / spriteWidth),
      sprite = null,
      spriteContext = null,
      result = [],
      i;

    for(i = 0; i < spriteCount; i++) {
      sprite = document.createElement('canvas');
      sprite.width  = spriteWidth;
      sprite.height = spriteHeight;

      spriteContext = sprite.getContext('2d');
      if(flip) {
        spriteContext.translate(spriteWidth, 0);
        spriteContext.scale(-1, 1);
      }
      spriteContext.drawImage(
        sourceAsset,
        i * spriteWidth, row * spriteHeight,
        spriteWidth, spriteHeight,
        0, 0,
        spriteWidth, spriteHeight
      );

      if(!isBlank(spriteContext, spriteWidth, spriteHeight)) {
        result.push(sprite);
      }
    }

    return result;
  }

  function isBlank(context, spriteWidth, spriteHeight) {
    var imageData = context.getImageData(0, 0, spriteWidth, spriteHeight);

    for(var i = 0; i < imageData.height; i++) {
      for(var j = 0; j < imageData.width; j++) {
        var index=(j*4)*imageData.width+(i*4);
        var alpha = imageData.data[index + 3];
        if(alpha !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  return {
    parse: parse
  };
});
