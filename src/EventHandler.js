'use strict';

// http://www.anujgakhar.com/2013/05/22/cross-browser-event-handling-in-javascript/
var EventHandler = {
  bind: function(el, ev, fn) {
    if(window.addEventListener) {
      el.addEventListener(ev, fn, false);
    } else if(window.attachEvent) {
      el.attachEvent('on' + ev, fn);
    } else {
      el['on' + ev] = fn;
    }
  },

  unbind: function(el, ev, fn) {
    if(window.removeEventListener) {
      el.removeEventListener(ev, fn, false);
    } else if(window.detachEvent) {
      el.detachEvent('on' + ev, fn);
    } else {
      el['on' + ev] = null;
    }
  },

  stop: function(ev) {
    var e = ev || window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }
};
