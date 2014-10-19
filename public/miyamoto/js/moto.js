/**
 * Created by Shaun on 10/5/14.
 */

// Object def
jack2d('PlayerObject', ['obj', 'input'], function(Obj, Input) {
  'use strict';

  return Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    'ActionObject',
    'FlowObject', {
    init: function(world, config) {
      this
        .startActions()
        .action('left', {key: Input.LEFT})
        .action('right', {key: Input.RIGHT})
        .action('up', {key: Input.UP})
        .action('down', {key: Input.DOWN})
        .startPhysics()
        .startCollisions(world)
        .startAnimations();

      Obj.merge(config, this);
    }
  }]);
});

// Factory
jack2d('Moto', ['obj', 'Flow', 'World', 'PlayerObject', 'Constants'],
  function(Obj, Flow, World, PlayerObject, Constants) {
    'use strict';

    var Animations = Constants.Animations,
      Directions = Constants.Directions;

    return function() {
      var moto = Obj.create(PlayerObject);

      moto.init(World, {
        x: 150,
        y : 118,
        width : 16,
        height : 32,
        frictionX : 0.99,
        maxVelocityX : 150,
        maxVelocityY : 300,
        accelerationY: 500,
        foo: {
          bar: {
            baz: 'hello'
          }
        }
      });

      moto
        .after('ActionObject')
        .when('left').andNot('ducking')
        .set('velocityX', -100)
        .when('right').andNot('ducking')
        .set('velocityX', 100)
        .when('up').and('canJump')
        .set('velocityY', -250)
        .when('down').and('canDuck')
        .set('ducking', true)
        .set('foo.bar.baz', 'gah!')
        .whenNot('down')
        .set('ducking', false);

      moto
        .after('AABBObject')
        .when('collisionLeft')
        .set('velocityX', 0)
        .when('collisionRight')
        .set('velocityX', 0)
        .when('collisionBottom')
        .set('canDuck', true)
        .whenNot('collisionBottom')
        .set('canDuck', false)
        .when('collisionBottom').andNot('up')
        .set('canJump', true)
        .whenNot('collisionBottom')
        .set('canJump', false);

      moto
        .after('spriteAnimation')
        .when('velocityX', function(vX) { return (vX <= -30); })
        .set('direction', Directions.DIR_RIGHT)
        .when('velocityX', function(vX) { return (vX >= 30); })
        .set('direction', Directions.DIR_LEFT)
        .when('collisionBottom')
        .playSequence(Animations.RUN)
        .when('collisionBottom').and('velocityX', function(vX){ return (Math.abs(vX) < 30); })
        .playSequence(Animations.IDLE)
        .when('ducking')
        .playSequence(Animations.DUCK)
        .whenNot('collisionBottom')
        .playSequence(Animations.JUMP);

      return moto;
    };
});
