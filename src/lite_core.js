;
(function() {
    'use strict'

    /***
    Litejs_core_utility 
    ***/
    var _dataTypeOf = function(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    var _hasClass = function(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }
    var _mixin = function(sourceObj, targetObj) {
        for (var key in sourceObj) {
            if (!(key in targetObj)) {
                targetObj[key] = sourceObj[key];
            }
        }
    }


    /***
    lite_core_selector
    ***/

    var l = function(selector) {
        return new _l(selector);
    }

    var _l = function(s) {
        this.elements = document.querySelectorAll(s);
    }

    /***
    lite-core-dom
    ***/

    _l.prototype.addClass = function(classNameArray) {
        el = this.elements;
        for (var i = 0; i < el.length; i++) {
            if (_dataTypeOf(classNameArray) !== "Array") {
                throw new TypeError("The classname should be an array instead of " +
                    _dataTypeOf(classNameArray))
            }
            for (var j = 0; j < classNameArray.length; j++) {
                if (!_hasClass(el[i], classNameArray[j])) {
                    el[i].className += ' ' + classNameArray[j];
                }
            }
        }
    }

    _l.prototype.removeClass = function(classNameArray) {
        el = this.elements;
        for (var i = 0; i < el.length; i++) {
            if (_dataTypeOf(classNameArray) !== "Array") {
                throw new TypeError("The classname should be an array instead of " +
                    _dataTypeOf(classNameArray))
            }
            for (var j = 0; j < classNameArray.length; j++) {
                var newClass = ' ' + el[i].className.replace(/[\t\r\n]/g, ' ') + ' ';
                if (_hasClass(elem, classNameArray[j])) {
                    while (newClass.indexOf(' ' + classNameArray[j] + ' ') >= 0) {
                        newClass = newClass.replace(' ' + classNameArray[j] + ' ', ' ');
                    }
                    el[i].className = newClass.replace(/^\s+|\s+$/g, '');
                }
            }
        }

    }

    _l.prototype.indexOf = function(parentNode) {
        return Array.prototype.indexOf.call(parentNode, this.elements[0]);
    }

    /***
    Litejs_core_class_factory
    ***/

    function extendsClass(parent, child) {

        var callSuper = parent.prototype;
        var newChild = function() {

            parent.call(this);
            child.call(this);
        }
        newChild.prototype = Object.create(parent.prototype, {
            constructor: {
                configurable: true,
                enumberable: true,
                value: newChild,
                writable: true
            },
            super: {
                configurable: true,
                enumberable: true,
                value: callSuper,
                writable: true
            }
        })

        newChild.callSuper = newChild.prototype.super

        return newChild;
    }

    /***
    Litejs_core_UI_component
    ***/

    //constructor for liteUI component base class
    function liteComponent() {
        this.defaults = {};
        this.prototype.init = function(options) {
            this.options = mixin(this.defaults, this.options);
        }
    }

    /***
    @Litejs-core-event
    @source:Javascript Ninja
    ***/

    /**
     *fix the event object in IE8 and below
     * 
     * @param  {[Object event]}
     * @return {[Object evnet]}
     */
    function _fixEvent(event) {

        function returnTrue() {
            return true;
        }

        function returnFalse() {
            return false;
        }

        if (!event || !event.stopPropagation) {
            var old = event || window.event;

            // Clone the old object so that we can modify the values
            event = {};

            for (var prop in old) {
                event[prop] = old[prop];
            }

            // The event occurred on this element
            if (!event.target) {
                event.target = event.srcElement || document;
            }

            // Handle which other element the event is related to
            event.relatedTarget = event.fromElement === event.target ?
                event.toElement :
                event.fromElement;

            // Stop the default browser action
            event.preventDefault = function() {
                event.returnValue = false;
                event.isDefaultPrevented = returnTrue;
            };

            event.isDefaultPrevented = returnFalse;

            // Stop the event from bubbling
            event.stopPropagation = function() {
                event.cancelBubble = true;
                event.isPropagationStopped = returnTrue;
            };

            event.isPropagationStopped = returnFalse;

            // Stop the event from bubbling and executing other handlers
            event.stopImmediatePropagation = function() {
                this.isImmediatePropagationStopped = returnTrue;
                this.stopPropagation();
            };

            event.isImmediatePropagationStopped = returnFalse;

            // Handle mouse position
            if (event.clientX != null) {
                var doc = document.documentElement,
                    body = document.body;

                event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // Handle key presses
            event.which = event.charCode || event.keyCode;

            // Fix button for mouse clicks:
            // 0 == left; 1 == middle; 2 == right
            if (event.button != null) {
                event.button = (event.button & 1 ? 0 :
                    (event.button & 4 ? 1 :
                        (event.button & 2 ? 2 : 0)));
            }
        }

        return event;
    }





    var _event = (function() {

        var cache = {},
            guidCounter = 1,
            expando = "data" + (new Date).getTime(),
            nextGuid = 1;

        var getData = function(elem) {
            var guid = elem[expando];
            if (!guid) {
                guid = elem[expando] = guidCounter++;
                cache[guid] = {};
            }

            return cache[guid];

        };

        var removeData = function(elem) {
            var guid = elem[expando];
            if (!guid) return;
            delete cache[guid];
            try {
                delete elem[expando];
            } catch (e) {
                if (elem.removeAttribute) {
                    elem.removeAttribute(expando);
                }
            }
        };

        var addEvent = function(elem, type, target, fn) {

            var data = getData(elem);
            var fn = fn || arguments[arguments.length-1];
            if(target.elements){
                target = target.elements[0];
            }
            if (!data.handlers) data.handlers = {};

            if (!data.handlers[type])
                data.handlers[type] = [];

            if (!fn.guid) fn.guid = nextGuid++;

            data.handlers[type].push(fn);

            if (!data.dispatcher) {
                data.disabled = false;
                data.dispatcher = function(event) {

                    if (data.disabled) return;
                    event = _fixEvent(event);

                    var handlers = data.handlers[event.type];
                    if (handlers && (event.target === target )) {
                        for (var n = 0; n < handlers.length; n++) {
                            handlers[n].call(elem, event);
                        }
                    }
                };
            }

            if (data.handlers[type].length == 1) {
                if (document.addEventListener) {
                    elem.addEventListener(type, data.dispatcher, false);
                } else if (document.attachEvent) {
                    elem.attachEvent("on" + type, data.dispatcher);
                }
            }

        };

        var removeEvent = function(elem, type, fn) {

            var data = getData(elem);

            if (!data.handlers) return;

            var removeType = function(t) {
                data.handlers[t] = [];
                _tidyUp(elem, t);
            };

            if (!type) {
                for (var t in data.handlers) removeType(t);
                return;
            }

            var handlers = data.handlers[type];
            if (!handlers) return;

            if (!fn) {
                removeType(type);
                return;
            }

            if (fn.guid) {
                for (var n = 0; n < handlers.length; n++) {
                    if (handlers[n].guid === fn.guid) {
                        handlers.splice(n--, 1);
                    }
                }
            }
            _tidyUp(elem, type);
        };

        /**
         *tidy up the data after removing the event
         * 
         * @param  {[Node]}
         * @param  {[String]}
         */
        function _tidyUp(elem, type) {

            function isEmpty(object) {
                for (var prop in object) {
                    return false;
                }
                return true;
            }

            var data = getData(elem);

            if (data.handlers[type].length === 0) {

                delete data.handlers[type];

                if (document.removeEventListener) {
                    elem.removeEventListener(type, data.dispatcher, false);
                } else if (document.detachEvent) {
                    elem.detachEvent("on" + type, data.dispatcher);
                }
            }

            if (isEmpty(data.handlers)) {
                delete data.handlers;
                delete data.dispatcher;
            }

            if (isEmpty(data)) {
                removeData(elem);
            }
        }

        return {
            addEvent: addEvent,
            removeEvent: removeEvent
        }
    })();

    //register event apis on _l object

    _l.prototype.addEvent = function(type, target, fn) {
        var el = this.elements;
        for (var i = 0; i < el.length; i++) {
            _event.addEvent(el[i], type, target, fn);
        }
    }
    _l.prototype.removeEvent = function(type, fn) {
        var el = this.elements;
        for (var i = 0; i < el.length; i++) {
            _event.removeEvent(el[i], type, fn);
        }
    }

    /***
    Litejs_ajax
    ***/

    var ajax = function(obj) {
        var xhr, setOption, beforeSend;
        setOption = function(obj) {
            obj.type = obj.type || "GET";
            obj.isAsync = obj.isAsync || true;
            return obj;
        }
        beforeSend = function(obj) {
            for (var header in obj.headers) {
                xhr.setRequestHeader(header, obj.headers[header]);
            }
        }
        obj = setOption(obj);
        xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    var data = xhr.responseText || xhr.responseXML;
                    obj.success(data, xhr.status);
                } else {
                    if (obj.error) {
                        obj.error(xhr.status);
                    }
                }
            }
        };
        xhr.open(obj.type, obj.url, obj.isAsync);
        if (obj.headers) {
            beforeSend(obj);
        }
        if (xhr.data) {
            xhr.send(null);
        } else {
            xhr.send(xhr.data)
        }
        return xhr;
    }

    l.ajax = ajax;


    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = l;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return l;
        });
    } else {
        this.l = l;
    }
}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
});
