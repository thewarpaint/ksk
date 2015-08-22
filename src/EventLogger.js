'use strict';

var EventLogger = {
  events: [],
  handlers: {},
  unicodeRegex: /^U\+[0-9a-fA-F]+$/,
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
    },
    keyup: {
      throttle: true,
      wait: 1000
    },
    submit: {
      auto: true
    },
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
      var logEntry = EventLogger.getEventData(event),
          position;

      if(event.type === 'mousemove') {
        position = Util.getMousePositionFromEvent(event);
        logEntry.x = position[0];
        logEntry.y = position[1];
      } else if(event.type === 'resize') {
        logEntry.clientWidth = document.documentElement.clientWidth;
        logEntry.clientHeight = document.documentElement.clientHeight;
      }

      Logger.log(JSON.stringify(logEntry));
    };
  },

  getEventData: function (event) {
    var properties = ['type', 'keyCode', 'keyIdentifier'],
        data = {
          target: this.getTargetData(event.target)
        };

    data.timestamp = Date.now();
    this.extractProperties(event, data, properties);

    if(event.type === 'keyup' && (!data.keyIdentifier || this.unicodeRegex.test(data.keyIdentifier))) {
      data.keyIdentifier = Util.getReadableKeyId(event);
    }

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
