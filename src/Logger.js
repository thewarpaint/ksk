'use strict';

var Logger = {
  socket: null,

  init: function () {
    this.socket = io('http://localhost:3000/');

    console.log('Logger ready!');
  },

  log: function (event) {
    UILogger.log(event);

    this.socket.emit('logEvent', event);
  }
};
