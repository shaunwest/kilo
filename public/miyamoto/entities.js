/**
 * Created by Shaun on 10/4/14.
 */

jack2d('Constants', [], function() {
  'use strict';

  return {
    Animations: {
      IDLE: 0,
      JUMP: 1,
      RUN: 2,
      DUCK: 3
    },

    Directions: {
      DIR_LEFT: 0,
      DIR_RIGHT: 1
    }
  };
});

jack2d('World', ['obj'], function(Obj) {
  'use strict';

  return Obj.create('collider');
});


jack2d('PlayerObject', ['obj'], function(Obj) {
  'use strict';

  return Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    'ActionObject'
  ]);
});

jack2d('Moto', ['Constants', 'Flow', 'input'], function(Constants, Flow, Input) {
  'use strict';
  var Animations = Constants.Animations,
    Directions = Constants.Directions;

  return function(world) {
    return Flow('PlayerObject')
      .set('x', 150).set('y', 118).set('width', 16).set('height', 32)
      .loadSpriteSheet('img/miyamoto.png')
      .startActions()
      .action('left', {key: Input.LEFT})
      .action('right', {key: Input.RIGHT})
      .action('up', {key: Input.UP})
      .action('down', {key: Input.DOWN})
      .when('left').andNot('ducking')
      .set('velocityX', -100)
      .when('right').andNot('ducking')
      .set('velocityX', 100)
      .when('up').and('canJump')
      .set('velocityY', -250)
      .done()

      .startPhysics()
      .set('frictionX', 0.99)
      .set('maxVelocityX', 150)
      .set('maxVelocityY', 300)
      .set('accelerationY', 500)

      .startCollisions(world)
      .when('collisionBottom')
      .set('onGround', true)
      .whenNot('collisionBottom')
      .set('onGround', false)
      .when('collisionLeft')
      .set('velocityX', 0)
      .when('collisionRight')
      .set('velocityX', 0)

      .when('onGround').and('down')
      .set('ducking', true)
      .when('onGround').andNot('down')
      .set('ducking', false)
      .when('onGround').andNot('up')
      .set('canJump', true)
      .whenNot('onGround')
      .set('canJump', false)

      .startAnimations()
      .when('velocityX', function(vX) { return (vX <= -30); })
      .set('direction', Directions.DIR_RIGHT)
      .when('velocityX', function(vX) { return (vX >= 30); })
      .set('direction', Directions.DIR_LEFT)
      .when('onGround')
      .playSequence(Animations.RUN)
      .when('onGround').and('velocityX', function(vX){ return (Math.abs(vX) < 30); })
      .playSequence(Animations.IDLE)
      .when('ducking')
      .playSequence(Animations.DUCK)
      .whenNot('onGround')
      .playSequence(Animations.JUMP)
      .done();
  };
});