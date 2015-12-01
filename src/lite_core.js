;
(function() {
    'use strict'

    /**
    *lite_core_utility 
    *
    *Utility fuctions for other core functionalities
    **/

    /**
     * [_dataTypeOf 
     * return the datatype of the given data using Object.prototype.toString.call()]
     * @param  data 
     * @return {[string]}  [datatype]
     */
    var _dataTypeOf = function(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }

    /**
     * [_hasClass
     * use RegExp to see if the given classname is in the element's classnames]
     * @param  {[dom node]}  elem     
     * @param  {[string]}  className 
     * @return {Boolean}           
     */
    var _hasClass = function(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    /**
     * [_mixin]
     * @param  {[obj]} sourceObj 
     * @param  {[obj]} targetObj 
     * @return {[obj]}          
     */
    
    var _mixin = function(sourceObj, targetObj) {
        for (var key in sourceObj) {
            if (!(key in targetObj)) {
                targetObj[key] = sourceObj[key];
            }
        }
        return targetObj;
    }


    /**
    *lite_core_selector
    *
    * Selector function. And constructor for the obj.
    **/

    /**
     * [l 
     * The selector function]
     * @param  {[string]} selector
     * @param  {[obj]}    context
     * @return {[obj]}          [a obj warps the acual dom node]
     */
    var l = function(selector,context) {
        return new _l(selector,context);
    }

    /**
     * [_l 
     * The constructor for the warpper obj.]
     * @param  {[string]} s [selector]
     * @param  {[obj]}    c [context]
     */
    var _l = function(s,c) {
        var context = c || document;
        if (_dataTypeOf(s) === "NodeList"){
            this.elements = s;
        }else{
            this.elements = context.querySelectorAll(s);
        }
    }

    /**
    *lite-core-dom
    *
    * Dom manipulation.
    **/

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

    /**
    *Litejs_core_ui_component
    *
    * Constructor for the UI component
    **/

    /**
     * [liteComponent
     * constructor for liteUI component base class]
     * @based on  *Developing Web Components* 
     * @param  {[obj]} options [description]
     */
    function liteComponent(options) {
        this.init(options);
        return this;
    }

    // https://github.com/jashkenas/backbone/blob/master/backbone.js#L1027
    // cached regex to split keys for `delegate`
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    liteComponent.prototype.defaults = {};

    liteComponent.prototype.init = function(options) {
            this.options = _mixin(this.defaults, options);
            if (_dataTypeOf(this.el) === "NodeList"){
                this.el = l(options.el);
            }else{
                this.el = options.el;
            }
            this.bind();
            return this;
    }

    liteComponent.prototype.event = {};

    // heavily based on Backbone.View.delegateEvents
    // https://github.com/jashkenas/backbone/blob/master/backbone.js#L1088
    // bind using event delegation
    liteComponent.prototype.bind = function () {

        var events = this.options.events 

        if (!events) {
            return this;
        }

        // prevent double binding of events
        this.unbind();

        // iterate over events hash
        for (var key in events) {
            var method = events[key];
            // if value is not a function then
            // find corresponding instance method
            //if (!$.isFunction(method)) {
              //  method = this[events[key]];
            //}
            // if a method does not exist move
            // to next item in the events hash
            if (!method) {
                continue;
            }

            // extract event name and selector from
            // property
            var match = key.match(delegateEventSplitter);
            var eventName = match[1];
            var selector = match[2];

            // bind event callback to widget instance
            //method = $.proxy(method, this);
            if (selector.length) {
                this.el.addEvent(eventName,method,selector);
            } else {
                this.el.addEvent(eventName, method);
            }
        }
    };

    // destroy instance
    liteComponent.prototype.destroy = function () {
        this.unbind();
        //this.$el.remove();
    };

    // used to unbind event handlers
    liteComponent.prototype.unbind = function () {
        this.el.removeEvent();
        return this;
    };

    l.liteComponent = liteComponent;

    /**
    *lite-core-event
    *@source:Javascript Ninja
    *
    * the event system
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

        var addEvent = function(elem, type, fn, target) {

            var data = getData(elem);

            if (!data.handlers) data.handlers = {};

            if(target){
                target = document.querySelectorAll(target)[0];
            }
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
                    if (handlers && (target ? (event.target === target):true )) {
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

    _l.prototype.addEvent = function(type, fn,target) {
        var el = this.elements;
        for (var i = 0; i < el.length; i++) {
            _event.addEvent(el[i], type,fn,target);
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

    /**
     *  export the moudule in one of commonjs || AMD || window way
     */
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
