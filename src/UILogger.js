'use strict';

var UILogger = {
  el: null,
  textProperty: null,

  init: function (elementId) {
    this.el = document.getElementById(elementId);
    this.textProperty = this.el.innerText ? 'innerText' : 'textContent';

    console.log('UILogger ready!');
  },

  log: function (event) {
    if(this.el) {
      this.el[this.textProperty] += JSON.stringify(event) + "\n\n";
    }
  }
};
