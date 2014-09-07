/**
 * Created by Shaun on 8/10/14.
 */

jack2d('Player', ['obj'], function(Obj) {
  'use strict';

  var Player = Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    //'FlowFactory',
    'ActionObject'
  ]);

  Player.IDLE = 0;
  Player.JUMP = 1;
  Player.RUN = 2;
  Player.DUCK = 3;

  return Player;
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

jack2d('Player.controls', ['FlowObject', 'Factory'], function(FlowObject, Factory) {
  'use strict';

  return Factory(FlowObject).
    when('left').andNot('ducking').
      set('velocityX', -100).
    when('right').andNot('ducking').
      set('velocityX', 100).
    when('up').and('canJump').
      set('velocityY', -250);
});

jack2d('Player.stuff', ['FlowObject', 'Factory'], function(FlowObject, Factory) {
  'use strict';
});
