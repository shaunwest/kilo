/**
 * Created by Shaun on 6/4/14.
 */

jack2d('platformer.entity', ['chrono'], function(chrono) {
  'use strict';

  return {
    init: function(props) {
      this.props = props;
      this.x = 0;
      this.y = 0;
      return this;
    }
  };
});
