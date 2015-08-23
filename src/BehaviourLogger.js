'use strict';

var BehaviourLogger = {
  userId: null,
  defaultEvents: ['click', 'scroll', 'wheel', 'mousewheel', 'resize', 'focus', 'focusin', 'focusout',
    'blur', 'mousemove', 'keyup', 'submit'],

  // Init all dependencies, calculate (random) user id, sent init event to the server
  init: function (events) {
    var event;
    Logger.init();
    EventLogger.init(events || this.defaultEvents);

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

  // Teardown all dependencies
  teardown: function () {
    EventLogger.teardown();
  }
};
