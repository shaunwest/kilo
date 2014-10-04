/**
 * Created by Shaun on 9/14/14.
 */

jack2d('SpriteLayer', ['helper', 'Requires'], function(Helper, Requires) {
  'use strict';

  function drawFrame(frame, x, y, context) {
    context.drawImage(
      frame,
      x, y
    );
  }

  return {
    addSprites: function(sprites) {
      var i, numSprites;
      for(i = 0, numSprites = sprites.length; i < numSprites; i++) {
        this.addSprite(sprites[i]);
      }
      return this;
    },
    addSprite: function(sprite) {
      /*if(!Helper.isDefined(this.layerWidth) || !Helper.isDefined(this.layerHeight)) {
        Helper.error('Jack2d: SpriteLayer: layerWidth and layerHeight are required');
      }*/

      if(!this.sprites) {
        this.sprites = [];
      }

      this.sprites.push(sprite);
      return this;
    },
    setLayerWidth: function(value) {
      this.layerWidth = value;
      return this;
    },
    setLayerHeight: function(value) {
      this.layerHeight = value;
      return this;
    },
    getLayerWidth: function() {
      return this.layerWidth;
    },
    getLayerHeight: function() {
      return this.layerHeight;
    },
    draw: Requires(['sprites'], function(context, viewport) {
      var i, numSprites, sprite, sprites;
      var xMin = viewport.x;
      var yMin = viewport.y;
      var xMax = xMin + viewport.width;
      var yMax = yMin + viewport.height;

      for(i = 0, sprites = this.sprites, numSprites = sprites.length; i < numSprites; i++) {
        sprite = sprites[i];
        if(sprite.x >= xMin && sprite.y >= yMin && sprite.x <= xMax && sprite.y <= yMax) {
          drawFrame(sprite.getCurrentFrame(), sprite.x - xMin, sprite.y - yMin, context);
        }
      }
      return this;
    }),
    drawFrame: function(frame, x, y, context) {
      drawFrame(frame, x, y, context);
      return this;
    }
  };
});