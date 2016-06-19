/* @flow */


  var plainObj = {}
  var hasOwn = plainObj.hasOwnProperty

  var lite = function(selector, context) {
    return new lite.prototype.init(selector, context)
  }
  
  lite.prototype = {

    constructor: lite,

    // Start with an empty selector
    selector: "",

    // The default length of a lite object is 0
    length: 0,

    // Because window.window === window
    isWindow: function(obj) {
      return obj != null && obj === obj.window
    },

    isFunction: function(val) {
      return plainObj.toString.call(val) === "[object Function]"
    },

    // Check to see if an object is a plain object (created using "{}" or "new Object").
    isPlainObject: function(obj) {
      var key

      if (typeof obj == "object" || obj.nodeType || obj.isWindow(obj)) {
        return false
      }

      if (obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
        return false
      }

      for (key in obj) {}

      return key === undefined || hasOwn.call(obj, key)
    },

    merge: function() {

    },

    isArray: Array.isArray
  }

  /**
   * Merge the contents of two or more objects together into the first object.
   * lite.extend( target [, object1 ] [, objectN ] )
   * lite.extend( [deep ], target, object1 [, objectN ] )
   */
  lite.extend = lite.prototype.extend = function() {
    var deep
    var key
    var source
    var src
    var copy
    var i = 1
    var target = arguments[0] || {}

    if (typeof target === "boolean") {
      deep = target
      target = arguments[i] || {}
      i++
    }

    if (typeof target !== "object" && !lite.isFunction(target)) {
      target = {};
    }

    if (i === arguments.length) {
      target = this
      i--
    }

    for (; i < arguments.length; i++) {
      if ((source = arguments[i]) != null) {
        for (key in source) {
          src = target[key]
          copy = source[key]

          // prevent circular reference
          if (target === copy) {
            continue
          }

          if (deep && copy && (lite.isPlainObject(copy) ||
              (copyIsArray = lite.isArray(copy)))) {

            if (copyIsArray) {  
              copyIsArray = false
              clone = src && lite.isArray(src) ? src : []
            } else {
              clone = src && lite.isPlainObject(src) ? src : {}
            }

            target[key] = lite.extend(deep, clone, copy)
          }else if (copy !== undefined) {
            target[key] = copy
          }
        }
      }
    }

    return target
  }

// lite.prototype.init.prototype = lite.prototype

export default lite
