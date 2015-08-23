'use strict';

var BehaviourLogger = {
  userId: null,
  defaultEvents: ['click', 'scroll', 'wheel', 'mousewheel', 'resize', 'focus', 'focusin', 'focusout',
    'blur', 'mousemove', 'keyup', 'submit'],

  init: function (events) {
    Logger.init();
    EventLogger.init(events || this.defaultEvents);
    UILogger.init('logger');

    this.userId = Math.floor(Math.random() * 9999999);
    console.log('BehaviourLogger ready!');

    event = {
      type: 'init',
      userId: this.userId,
      timestamp: Date.now(),
      userAgent: window.navigator.userAgent
    };

    Logger.log(event);
  },
  }
};
