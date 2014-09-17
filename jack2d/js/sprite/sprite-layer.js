/**
 * Created by Shaun on 9/14/14.
 */

jack2d('SpriteLayer', ['helper'], function(Helper) {
  'use strict';

  return {
    addSprites: function(sprites) {
      var i, numSprites;
      for(i = 0, numSprites = sprites.length; i < numSprites; i++) {
        this.addSprite(sprites[i]);
      }
      return this;
    },
    addSprite: function(sprite) {
      if(!this.sprites) {
        this.sprites = [];
      }
      this.sprites.push(sprite);

      if(!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
      }

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
    getPixelWidth: function() {
      return this.layerWidth;
    },
    getPixelHeight: function() {
      return this.layerHeight;
    },
    getLayer: function() {
      return this.canvas;
    },
    clear: function() {
      this.context.clearRect(0, 0, this.getPixelWidth(), this.getPixelHeight());
      return this;
    },
    draw: function() {
      var i, numSprites, sprites;
      if(!this.sprites) {
        return this;
      }
      this.clear();

      sprites = this.sprites;
      for(i = 0, numSprites = sprites.length; i < numSprites; i++) {
        this.drawSprite(sprites[i]);
      }
      return this;
    },
    drawSprite: function(sprite) {
      this.context.drawImage(
        sprite.getCurrentFrame(),
        sprite.x, sprite.y
      );
      return this;
    }
  };
});