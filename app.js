'use strict';

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

var Logger = {
  el: null,

  init: function () {
    this.el = document.getElementById('logger');
  },

  log: function (message) {
    this.el.innerText += message + "\n";
  }
};

var EventLogger = {
  events: [],
  handlers: {},

  init: function (events) {
    for(var i=0; i<events.length; i++) {
      EventHandler.bind(window, events[i], this.getHandler(events[i]));
    }
  },

  getHandler: function (event) {
    return function (e) {
      Logger.log(event + ' on ' + e.target.tagName);
    };
  }
};

var BehaviourLogger = {
  userId: null,

  init: function () {
    Logger.init();
    EventLogger.init(['click', 'scroll', 'resize']);

    this.userId = Math.floor(Math.random() * 9999999);
    Logger.log('Init! User id: ' + this.userId);
  }
};

if(document.addEventListener) {
  document.addEventListener('DOMContentLoaded', BehaviourLogger.init);
} else if(document.attachEvent) {
  document.attachEvent("onreadystatechange", function () {
    if(document.readyState === "complete") {
      BehaviourLogger.init();
    }
  });
}
