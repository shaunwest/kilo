/**
 * Created by Shaun on 10/5/14.
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

// Object Definition
jack2d('PlayerObject', ['obj', 'input'], function(Obj, Input) {
  'use strict';

  return Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    'ActionObject', {
    init: function(world) {
      this
        .startActions()
        .action('left', {key: Input.LEFT})
        .action('right', {key: Input.RIGHT})
        .action('up', {key: Input.UP})
        .action('down', {key: Input.DOWN})
        .startPhysics()
        .startCollisions(world)
        .loadSpriteSheet('img/miyamoto.png')
        .startAnimations();
    }
  }]);
});

// Fragment
jack2d('player.movement', ['Flow', 'input'], function(Flow, Input) {
  'use strict';

  return function(target) {
    target
      .startActions()
      .action('left', {key: Input.LEFT})
      .action('right', {key: Input.RIGHT})
      .action('up', {key: Input.UP})
      .action('down', {key: Input.DOWN});

    /*Flow(target)
      .when('left').andNot('ducking')
      .set('velocityX', -100)
      .when('right').andNot('ducking')
      .set('velocityX', 100)
      .when('up').and('canJump')
      .set('velocityY', -250)
      .done();*/

    return target;
  };
});

// Fragment
jack2d('entity.physics', ['obj'], function(Obj) {
  'use strict';

  return function(target) {
    target.startPhysics();

    Obj.merge({
      frictionX: 0.99,
      maxVelocityX: 150,
      maxVelocityY: 300,
      accelerationY: 500
    }, target);

    return target;
  };
});

// Fragment
jack2d('entity.collisions', ['Flow'], function(Flow) {
  'use strict';

  return function(target, world) {
    target.startCollisions(world);

    /*Flow(target)
      .when('collisionBottom') // can be simplified to just use collisionBottom instead of onGround
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
      .done();*/


    return target;
  };
});

// Fragment
jack2d('player.animations', ['Flow', 'Constants'], function(Flow, Constants) {
  'use strict';

  var Animations = Constants.Animations,
    Directions = Constants.Directions;

  return function(target) {
    target.loadSpriteSheet('img/miyamoto.png');

    /*Flow(target)
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
      .done();*/

    target.startAnimations();

    return target;
  };
});

// Moto Factory
jack2d('Moto', ['obj', 'Flow', 'World', 'PlayerObject', 'player.movement', 'entity.physics', 'entity.collisions', 'player.animations', 'Constants'],
  function(Obj, Flow, World, PlayerObject, movement, physics, collisions, animations, Constants) {
    'use strict';

    var Animations = Constants.Animations,
      Directions = Constants.Directions;

    return function() {
      var moto = Obj.create(PlayerObject);
      moto.init(World);
      moto.x = 150;
      moto.y = 118;
      moto.width = 16;
      moto.height = 32;
      moto.frictionX = 0.99;
      moto.maxVelocityX = 150;
      moto.maxVelocityY = 300;
      moto.accelerationY= 500;

      //World.addObject(moto);

      /*movement(moto);
      physics(moto);
      collisions(moto, World);
      animations(moto);*/

      // "ACTUALS" -- setting properties/calling functions that affect the object's internals
      Flow(moto, 1, moto.getChronoId('action-object'))
        .when('left').andNot('ducking')
        .set('velocityX', -100)
        .when('right').andNot('ducking')
        .set('velocityX', 100)
        .when('up').and('canJump')
        .set('velocityY', -250)
        .when('down').and('canDuck')
        .set('ducking', true)
        .whenNot('down')
        .set('ducking', false)
        .done();
        /*.whenNot('canGoLeft')
        .set('velocityX', 0)
        .whenNot('canGoRight')
        .set('velocityX', 0)
        .done();*/

      //physics(moto);
      //collisions(moto, World);

      // "POSSIBILITIES" -- setting properties that have no direct affect on the object
      Flow(moto, 1, moto.getChronoId('physics'))
        .when('collisionLeft')
        .set('velocityX', 0)
        .when('collisionRight')
        .set('velocityX', 0)
        /*.when('collisionLeft')
         .set('canGoLeft', false)
         .whenNot('collisionLeft')
         .set('canGoLeft', true)
         .when('collisionRight')
         .set('canGoRight', false)
         .whenNot('collisionRight')
         .set('canGoRight', true)*/

        .when('collisionBottom')
        .set('canDuck', true)
        .whenNot('collisionBottom')
        .set('canDuck', false)
        .when('collisionBottom').andNot('up')
        .set('canJump', true)
        .whenNot('collisionBottom')
        .set('canJump', false)
        .done();

      //animations(moto);

      // "VIEW" -- setting properties/calling functions that affect the visual appearance of the object
      Flow(moto, 1, moto.getChronoId('sprite-animation'))
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
        .playSequence(Animations.JUMP)
        .done();

      return moto;
    };
});
