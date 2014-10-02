/**
 * Created by Shaun on 9/14/14.
 */

jack2d('SpriteLayer', ['helper', 'Requires'], function(Helper, Requires) {
  'use strict';

  function clearContext(context, width, height) {
    context.clearRect(0, 0, width, height);
  }

  function drawFrame(frame, x, y, context) {
    context.drawImage(
      frame,
      x, y
    );
  }

  function resizeCanvas(canvas, width, height) {
    if(!canvas) {
      return;
    }
    if(Helper.isDefined(width)) {
      canvas.width = width;
    }

    if(Helper.isDefined(height)) {
      canvas.height = height;
    }
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
      if(!Helper.isDefined(this.layerWidth) || !Helper.isDefined(this.layerHeight)) {
        Helper.error('Jack2d: SpriteLayer: layerWidth and layerHeight are required');
      }

      if(!this.sprites) {
        this.sprites = [];
      }

      if(!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        resizeCanvas(this.canvas, this.layerWidth, this.layerHeight);
      }

      this.sprites.push(sprite);
      return this;
    },
    setLayerWidth: function(value) {
      this.layerWidth = value;
      resizeCanvas(this.canvas, this.layerWidth, this.layerHeight);
      return this;
    },
    setLayerHeight: function(value) {
      this.layerHeight = value;
      resizeCanvas(this.canvas, this.layerWidth, this.layerHeight);
      return this;
    },
    getLayerWidth: function() {
      return this.layerWidth;
    },
    getLayerHeight: function() {
      return this.layerHeight;
    },
    getLayer: function() {
      return this.canvas;
    },
    clear: function() {
      if(this.context) {
        clearContext(this.context, this.layerWidth, this.layerHeight);
      }
      return this;
    },
    draw: Requires(['context', 'sprites'], function(context, viewport) {
      var i, numSprites, sprite, sprites;
      var xMin = viewport.x;
      var yMin = viewport.y;
      var xMax = xMin + viewport.width;
      var yMax = yMin + viewport.height;
      //clearContext(context = this.context, this.layerWidth, this.layerHeight);
      //clearContext(context, this.layerWidth, this.layerHeight); // should become unnecessary

      for(i = 0, sprites = this.sprites, numSprites = sprites.length; i < numSprites; i++) {
        sprite = sprites[i];
        if(sprite.x >= xMin && sprite.y >= yMin && sprite.x <= xMax && sprite.y <= yMax) {
          drawFrame(sprite.getCurrentFrame(), sprite.x - xMin, sprite.y - yMin, context);
        }
      }
      return this;
    })
    /*drawSprite: function(sprite) {
      if(this.context) {
        drawSprite(sprite, this.context);
      }
      return this;
    }*/
  };
});