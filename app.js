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

var Logger = {
  el: null,
  textProperty: null,

  init: function () {
    this.el = document.getElementById('logger');

    this.textProperty = this.el.innerText ? 'innerText' : 'textContent';

    console.log('Logger ready!');
  },

  log: function (message) {
    this.el[this.textProperty] += message + "\n";
  }
};

var EventLogger = {
  events: [],
  handlers: {},
  supported: {
    click: {
      auto: true
    },
    scroll: {
      throttle: true,
      wait: 1000
    },
    wheel: {
      throttle: true,
      wait: 1000
    },
    mousewheel: {
      throttle: true,
      wait: 1000
    },
    resize: {
      throttle: true,
      wait: 1000
    },
    focus: {
      auto: true
    },
    focusin: {
      auto: true
    },
    focusout: {
      auto: true
    },
    blur: {
      auto: true
    },
    mousemove: {
      throttle: true,
      wait: 1000
    }
  },

  init: function (events) {
    var handler;

    for(var i=0; i<events.length; i++) {
      if(this.supported[events[i]]) {
        handler = this.getHandler(events[i]);

        if(!this.supported[events[i]].auto) {
          if(this.supported[events[i]].throttle) {
            handler = Util.throttle(handler, this.supported[events[i]].wait);
          }
        }

        EventHandler.bind(window, events[i], handler);
      }
    }

    console.log('EventLogger ready!');
  },

  // Refactor without closure
  getHandler: function (/*eventName*/) {
    return function (event) {
      console.log(event);
      var logEntry = EventLogger.getEventData(event);

      Logger.log(JSON.stringify(logEntry));
    };
  },

  getEventData: function (event) {
    var properties = ['type'],
        data = {
          target: this.getTargetData(event.target)
        };

    data.timestamp = Date.now();

    this.extractProperties(event, data, properties);

    return data;
  },

  getTargetData: function (target) {
    var properties = ['id', 'name', 'className', 'value'],
        data = {
          tagName: target.tagName ? target.tagName.toLowerCase() : 'html'
        };

    this.extractProperties(target, data, properties);

    if(target.form) {
      data.form = this.getTargetData(target.form);
    }

    return data;
  },

  extractProperties: function (src, dest, properties) {
    // Add forEach polyfill?
    for(var i=0; i<properties.length; i++) {
      if(src[properties[i]]) {
        dest[properties[i]] = src[properties[i]];
      }
    }
  }
};

var BehaviourLogger = {
  userId: null,

  init: function () {
    Logger.init();
    EventLogger.init(['click', 'scroll', 'wheel', 'mousewheel', 'resize', 'focus', 'focusin', 'focusout',
      'blur', 'mousemove']);

    this.userId = Math.floor(Math.random() * 9999999);
    Logger.log('BehaviourLogger ready! User id: ' + this.userId + ', timestamp: ' + Date.now());
  }
};

if(document.addEventListener) {
  document.addEventListener('DOMContentLoaded', BehaviourLogger.init);
} else if(document.attachEvent) {
  document.attachEvent('onreadystatechange', function () {
    if(document.readyState === 'complete') {
      BehaviourLogger.init();
    }
  });
}

