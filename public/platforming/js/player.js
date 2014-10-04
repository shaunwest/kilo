/**
 * Created by Shaun on 8/10/14.
 */

jack2d('Player', ['obj'], function(Obj) {
  'use strict';

  var Player = Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    'ActionObject'
  ]);

  Player.IDLE = 0;
  Player.JUMP = 1;
  Player.RUN = 2;
  Player.DUCK = 3;

  return Player;
});

jack2d('PlayerFlow', ['Player', 'Player.controls', 'Flow', 'input'], function(Player, PlayerControls, Flow, Input) {
  'use strict';
  var DIR_LEFT = 0,
    DIR_RIGHT = 1;

  return function(spriteSheet, world) {
    return Flow('Player')
      .loadSpriteSheet(spriteSheet)
      .startActions()
      .action('left', {key: Input.LEFT})
      .action('right', {key: Input.RIGHT})
      .action('up', {key: Input.UP})
      .action('down', {key: Input.DOWN})
      /*.get(function(player) {
        this.include(PlayerControls(player));
      })*/
      .include(PlayerControls)
      /*.when('left').andNot('ducking')
        .set('velocityX', -100)
      .when('right').andNot('ducking')
        .set('velocityX', 100)
      .when('up').and('canJump')
        .set('velocityY', -250)
        .done()*/

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

      .when('autoWalk')
        .set('velocityX', -100)
        .set('allowActions', false)
      .when('x', function(x) { return (x <= 48); })
        .set('autoWalk', false)
        .set('allowActions', true)
        .done()
      .whenGroup('fooMode')
        .whenNot('onGround')
          .inc('foo', 1)
          .done()

      .startAnimations()
      .when('velocityX', function(vX) { return (vX <= -30); })
        .set('direction', DIR_RIGHT)
      .when('velocityX', function(vX) { return (vX >= 30); })
        .set('direction', DIR_LEFT)
      .when('onGround')
        .playSequence(Player.RUN)
      .when('onGround').and('velocityX', function(vX){ return (Math.abs(vX) < 30); })
        .playSequence(Player.IDLE)
      .when('ducking')
        .playSequence(Player.DUCK)
      .whenNot('onGround')
        .playSequence(Player.JUMP)
        .done();
  };
});

jack2d('PlayerFactory', ['Factory', 'Player'], function(Factory, Player) {
  'use strict';

  return function() {
    var newPlayer = Factory(Player);
    newPlayer.x = 150;
    newPlayer.y = 118;
    newPlayer.width = 16;
    newPlayer.height = 32;
    return newPlayer;
  };
});

jack2d('Player.controls', ['FlowDefinition'], function(FlowDefinition) {
  'use strict';

  return function(player) {
    return FlowDefinition(player).
      when('left').andNot('ducking').
        set('velocityX', -100).
      when('right').andNot('ducking').
        set('velocityX', 100).
      when('up').and('canJump').
        set('velocityY', -250).
      done();
  };
});
