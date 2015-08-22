'use strict';

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
