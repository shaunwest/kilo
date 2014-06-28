/**
 * Created by Shaun on 6/26/14.
 */


jack2d('element', ['helper', 'doc', 'deferred'], function(helper, doc, deferred) {
  'use strict';

  return {
    el: function(elementOrSelector) {
      var promise = doc.getElement(elementOrSelector);

      promise.then(helper.call(this, function(element) {
        this.element = element;
        deferred.executeDeferred(this);
      }), function() {
        // error
      });

      //this.el.promise = promise; // doesn't work because el.promise isn't set until el() gets called...
      return this;
    }
  };
});

