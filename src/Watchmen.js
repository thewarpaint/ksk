'use strict';

var Watchmen = {
  init: function (events) {
    BehaviourLogger.init(events);
  },

  logCustomEvent: function (event) {
    event.isCustom = true;
    Logger.log(JSON.stringify(event));
  }
};
