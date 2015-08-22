'use strict';

var BehaviourLogger = {
  userId: null,
  defaultEvents: ['click', 'scroll', 'wheel', 'mousewheel', 'resize', 'focus', 'focusin', 'focusout',
    'blur', 'mousemove', 'keyup', 'submit'],

  init: function (events) {
    Logger.init();
    EventLogger.init(events || this.defaultEvents);

    this.userId = Math.floor(Math.random() * 9999999);
    console.log('BehaviourLogger ready!');
    Logger.log('User id: ' + this.userId + ', timestamp: ' + Date.now());
  }
};
