'use strict';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

// Firefox patch for focusin, focusout events
// https://gist.github.com/nuxodin/9250e56a3ce6c0446efa
(function() {
  var w = window,
      d = w.document;

  function addPolyfill(e) {
    var type = e.type === 'focus' ? 'focusin' : 'focusout';
    var event = new CustomEvent(type, { bubbles: true, cancelable: false });
    event.c1Generated = true;
    e.target.dispatchEvent( event );
  }

  function removePolyfill(e) {
    if(!e.c1Generated) { // focus after focusin, so chrome will the first time trigger tow times focusin
        d.removeEventListener('focus'   , addPolyfill   , true);
        d.removeEventListener('blur'    , addPolyfill   , true);
        d.removeEventListener('focusin' , removePolyfill, true);
        d.removeEventListener('focusout', removePolyfill, true);
    }
    setTimeout(function () {
        d.removeEventListener('focusin' , removePolyfill, true);
        d.removeEventListener('focusout', removePolyfill, true);
    });
  }

  if(typeof w.onfocusin === 'undefined') {
    d.addEventListener('focus'   , addPolyfill   , true);
    d.addEventListener('blur'    , addPolyfill   , true);
    d.addEventListener('focusin' , removePolyfill, true);
    d.addEventListener('focusout', removePolyfill, true);
  }
})();

var Util = {
  // https://github.com/jashkenas/underscore/blob/master/underscore.js#L800
  throttle: function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
};
