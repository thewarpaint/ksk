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
  },

  // http://stackoverflow.com/a/7790764
  getMousePositionFromEvent: function (event) {
    var eventDoc, doc, body;

    event = event || window.event;

    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    return [event.pageX, event.pageY];
  },

  // https://gist.github.com/spektraldevelopment/c878922803e6101f66f4
  getReadableKeyId: function (evt) {
  	var keyName,
    		keyMap, code = evt.keyCode,
    		isShift = evt.shiftKey ? true : false;
    		// isCtrl = evt.ctrlKey ? true : false,
    		// isAlt = evt.altKey ? true : false;

  	keyMap = {
  		8: 'BACK_SPACE',
  		9: 'TAB',
  		13: 'ENTER',
  		16: 'SHIFT',
  		17: 'CTRL',
  		18: 'ALT',
  		19: 'PAUSE_BREAK',
  		20: 'CAPS_LOCK',
  		27: 'ESCAPE',
  		33: 'PAGE_UP',
  		34: 'PAGE_DOWN',
  		35: 'END',
  		36: 'HOME',
  		37: 'LEFT',
  		38: 'UP',
  		39: 'RIGHT',
  		40: 'DOWN',
  		45: 'INSERT',
  		46: 'DELETE',
  		48: '0',
  		49: '1',
  		50: '2',
  		51: '3',
  		52: '4',
  		53: '5',
  		54: '6',
  		55: '7',
  		56: '8',
  		57: '9',
    	61: 'EQUALS_SIGN',
  		65: 'A',
  		66: 'B',
  		67: 'C',
    	68: 'D',
  		69: 'E',
  		70: 'F',
  		71: 'G',
  		72: 'H',
  		73: 'I',
  		74: 'J',
  		75: 'K',
  		76: 'L',
  		77: 'M',
  		78: 'N',
  		79: 'O',
  		80: 'P',
  		81: 'Q',
  		82: 'R',
  		83: 'S',
  		84: 'T',
  		85: 'U',
  		86: 'V',
  		87: 'W',
  		88: 'X',
  		89: 'Y',
  		90: 'Z',
  		91: 'LEFT_WINDOW_KEY',
  		92: 'RIGHT_WINDOW_KEY',
  		93: 'SELECT_KEY',
  		96: 'NUMPAD_0',
  		97: 'NUMPAD_1',
  		98: 'NUMPAD_2',
  		99: 'NUMPAD_3',
  		100: 'NUMPAD_4',
  		101: 'NUMPAD_5',
  		102: 'NUMPAD_6',
  		103: 'NUMPAD_7',
  		104: 'NUMPAD_8',
  		105: 'NUMPAD_9',
  		106: 'MULTIPLY',
  		107: 'ADD',
  		109: 'SUBTRACT',
  		110: 'DECIMAL_POINT',
  		111: 'DIVIDE',
  		112: 'F1',
  		113: 'F2',
  		114: 'F3',
  		115: 'F4',
  		116: 'F5',
  		117: 'F6',
  		118: 'F7',
  		119: 'F8',
  		120: 'F9',
  		121: 'F10',
  		122: 'F11',
  		123: 'F12',
  		144: 'NUM_LOCK',
  		145: 'SCROLL_LOCK',
    	173: 'HYPHEN',
  		186: 'SEMI_COLON',
  		187: 'EQUAL_SIGN',
  		188: 'COMMA',
  		189: 'DASH',
  		190: 'PERIOD',
  		191: 'FORWARD_SLASH',
  		192: 'BACK_TICK',
  		219: 'OPEN_SQUARE_BRACKET',
  		221: 'CLOSE_SQUARE_BRACKET',
  		222: 'SINGLE_QUOTE',
    	224: 'COMMAND'
  	};

  	if(code === 192 && isShift === true) {
  		keyName = 'TILDA';
  	} else if (code === 49 && isShift === true) {
  		keyName = 'EXCLAMATION_POINT';
  	} else if (code === 50 && isShift === true) {
  		keyName = 'AT_SIGN';
  	} else if (code === 51 && isShift === true) {
  		keyName = 'HASHTAG';
  	} else if (code === 52 && isShift === true) {
  		keyName = 'DOLLAR_SIGN';
  	} else if (code === 53 && isShift === true) {
  		keyName = 'PERCENT';
  	} else if (code === 54 && isShift === true) {
  		keyName = 'CARET';
  	} else if (code === 55 && isShift === true) {
  		keyName = 'AMPERSAND';
  	} else if (code === 56 && isShift === true) {
  		keyName = 'ASTERISK';
  	} else if (code === 57 && isShift === true) {
  		keyName = 'OPEN_BRACKET';
  	} else if (code === 58 && isShift === true) {
  		keyName = 'CLOSE_BRACKET';
  	} else if (code === 173 && isShift === true) {
  		keyName = 'UNDERSCORE';
  	} else if (code === 61 && isShift === true) {
  		keyName = 'PLUS_SIGN';
  	} else {
  		keyName = keyMap[code];
  	}

  	return keyName;
  }
};
