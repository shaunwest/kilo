/**
 * Created by Shaun on 6/26/14.
 */


jack2d('element', ['helper', 'doc', 'proxy', 'input'], function(helper, doc, proxy, input) {
  'use strict';

  return {
    el: function(elementOrSelector) {
      var promise = doc.getElement(elementOrSelector);

      promise.then(helper.call(this, function(element) {
        this.element = element;
        //input.addAction('tap', {element: element});
        proxy.executeDeferred(this);
      }), function(error) {
        console.log(error);
      });

      return this;
    },
    setStyle: proxy.defer(function(prop, value) {
      this.element.style[prop] = value;
      return this;
    }),
    /*click: proxy.defer(function(callback) {
      this.element.addEventListener('click', callback, false);
      return this;
    })*/
    onInteract: proxy.defer(function(callback) {
      var element = this.element;
      input.onInputUpdate(function(inputs) {
        if(inputs.interact && inputs.interact.target === element) {
          callback(element);
        }
      });
      return this;
    })
  };
});

