'use strict';

var Watchmen = {
  // Init all dependencies
  init: function (events) {
    BehaviourLogger.init(events);
  },

  // Teardown all dependencies
  teardown: function () {
    BehaviourLogger.teardown();
  },

  // Used in case events are cancelled/stopped for some reason.
  logCustomEvent: function (event) {
    event.isCustom = true;
    Logger.log(event);
  },

  enableDebug: function (elementId) {
    UILogger.init(elementId);
  }
};

window.Watchmen = Watchmen;
