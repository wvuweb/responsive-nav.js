/* exported checkPassiveEventSupport, addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach, hasClass, toggleFocus */


/**
 * Check support for passive event listeners
 *
 * @return {bool} Returns whether {passive: true} can be used
 */

var checkPassiveEventSupport = function () {
    var supported = false;

  try {
    var opts = {
      get passive() {
        supported = true;
      }
    };

    if ("addEventListener" in window) {
      window.addEventListener("test", null, opts);
      window.removeEventListener("test", null, opts);
    }
  } catch (e) {
    supported = false;
  }
  return supported;
};

/**
 * Add Event
 * fn arg can be an object or a function, thanks to handleEvent
 * read more at: http://www.thecssninja.com/javascript/handleevent
 *
 * @param  {element}  element
 * @param  {event}    event
 * @param  {Function} fn
 * @param  {boolean}  bubbling
 */
var addEvent = function (el, evt, fn, bubble) {
  // set passive events if this is supported
  var options = checkPassiveEventSupport ? {passive: true, capture: bubble} : bubble;

  if ("addEventListener" in el) {
    // BBOS6 doesn't support handleEvent, catch and polyfill
    try {
      el.addEventListener(evt, fn, options);
    } catch (e) {
      if (typeof fn === "object" && fn.handleEvent) {
        el.addEventListener(evt, function (e) {
          // Bind fn as this and set first arg as event object
          fn.handleEvent.call(fn, e);
        }, options);
      } else {
        throw e;
      }
    }
  } else if ("attachEvent" in el) {
    // check if the callback is an object and contains handleEvent
    if (typeof fn === "object" && fn.handleEvent) {
      el.attachEvent("on" + evt, function () {
        // Bind fn as this
        fn.handleEvent.call(fn);
      });
    } else {
      el.attachEvent("on" + evt, fn);
    }
  }
};


/**
 * Remove Event
 *
 * @param  {element}  element
 * @param  {event}    event
 * @param  {Function} fn
 * @param  {boolean}  bubbling
 */
var removeEvent = function (el, evt, fn, bubble) {
  if ("removeEventListener" in el) {
    try {
      el.removeEventListener(evt, fn, bubble);
    } catch (e) {
      if (typeof fn === "object" && fn.handleEvent) {
        el.removeEventListener(evt, function (e) {
          fn.handleEvent.call(fn, e);
        }, bubble);
      } else {
        throw e;
      }
    }
  } else if ("detachEvent" in el) {
    if (typeof fn === "object" && fn.handleEvent) {
      el.detachEvent("on" + evt, function () {
        fn.handleEvent.call(fn);
      });
    } else {
      el.detachEvent("on" + evt, fn);
    }
  }
};

/**
 * Get the children of any element
 *
 * @param  {element}
 * @return {array} Returns matching elements in an array
 */
var getChildren = function (e) {
  if (e.children.length < 1) {
    throw new Error("The Nav container has no containing elements");
  }
  // Store all children in array
  var children = [];
  // Loop through children and store in array if child != TextNode
  for (var i = 0; i < e.children.length; i++) {
    if (e.children[i].nodeType === 1) {
      children.push(e.children[i]);
    }
  }
  return children;
};

/**
 * Sets multiple attributes at once
 *
 * @param {element} element
 * @param {attrs}   attrs
 */
var setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/**
 * Adds a class to any element
 *
 * @param {element} element
 * @param {string}  class
 */
var addClass = function (el, cls) {
  el.classList.add(cls);
};

/**
 * Remove a class from any element
 *
 * @param  {element} element
 * @param  {string}  class
 */
var removeClass = function (el, cls) {
  el.classList.remove(cls);
};

/**
 * forEach method that passes back the stuff we need
 *
 * @param  {array}    array
 * @param  {Function} callback
 * @param  {scope}    scope
 */
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};

/**
 * Checks if an element has certain class
 *
 * @param  {element}  element
 * @param  {string}   class name
 * @return {Boolean}
 */
var hasClass = function (el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
};

/**
 * Sets or removes .focus class on an element.
 */
var toggleFocus = function () {
  var self = this;
  var menuItems = opts.menuItems;

  // Move up through the ancestors of the current link until we hit 'menu-items' class.
  // That's top level ul-element class name.
  while ( -1 === self.className.indexOf( menuItems ) ) {

    // On li elements toggle the class .focus.
    if ( "li" === self.tagName.toLowerCase() ) {
      if ( -1 !== self.className.indexOf("focus") ) {
        self.classList.remove("focus");
      } else {
        self.classList.add("focus");
      }
    }
    self = self.parentElement;
  }
};
