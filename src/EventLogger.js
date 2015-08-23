'use strict';

var EventLogger = {
  handlers: [],
  unicodeRegex: /^U\+[0-9a-fA-F]+$/,

  // Supported events and additional behaviour for each one (only throttle and wait time so far)
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

  // Add handlers for all selected events, making sure they are supported (whitelisted)
  init: function (events) {
    var handler;

    for(var i=0; i<events.length; i++) {
      if(this.supported[events[i]]) {
        handler = this.eventHandler;

        if(!this.supported[events[i]].auto) {
          if(this.supported[events[i]].throttle) {
            handler = Util.throttle(handler, this.supported[events[i]].wait);
          }
        }

        EventHandler.bind(window, events[i], handler);
        this.handlers.push({ eventName: events[i], handler: handler });
      }
    }

    console.log('EventLogger ready!');
  },

  // Remove all handlers
  teardown: function () {
    for(var i=0; i<this.handlers.length; i++) {
      EventHandler.unbind(window, this.handlers[i].eventName, this.handlers[i].handler);
    }
  },

  // Generic event handler for all events, with specific behaviour for some (processing data, etc.)
  // TODO: Add specific behaviour as functions in the supported event list?
  eventHandler: function (event) {
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

    logEntry.userId = BehaviourLogger.userId;
    Logger.log(logEntry);
  },

  // Get the required data for an event and its target, add timestamp and process keyup info
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

  // Get the required data for a target and its parent form, if any
  getTargetData: function (target) {
    var properties = ['id', 'name', 'className', 'value', 'checked', 'method', 'action'],
        data = {
          tagName: target.tagName ? target.tagName.toLowerCase() : 'html'
        };

    this.extractProperties(target, data, properties);

    if(target.form) {
      data.form = this.getTargetData(target.form);
    }

    return data;
  },

  // Add properties from src to dest
  extractProperties: function (src, dest, properties) {
    // TODO: Add forEach polyfill?
    for(var i=0; i<properties.length; i++) {
      if(src[properties[i]]) {
        dest[properties[i]] = src[properties[i]];
      }
    }
  }
};
