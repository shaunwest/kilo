/**
 * Created by Shaun on 8/10/14.
 */

jack2d('Player', ['obj'], function(Obj) {
  'use strict';

  var Player = Obj.mixin([
    'platformer.PhysicsObject',
    'spriteAnimation',
    'AABBObject',
    'FlowFactory',
    'ActionObject'
  ]);

  Player.IDLE = 0;
  Player.JUMP = 1;
  Player.RUN = 2;

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