define([], function () {
    /***
    Litejs_dom v0.0.1
    ***/
    var _hasClass = function (elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    var addClass = function (elem, className) {
        if (!_hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    }

    var removeClass = function (elem, className) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (_hasClass(elem, className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }
    var indexOf = function (parent, child) {
        return Array.prototype.indexOf.call(parent, child);
    }

    /***
    Litejs_event 
    ***/
    var _Event = function () {
        this._listener = {};
    };

    _Event.prototype = {
        constructor: this,
        addEvent: function (type, fn) {
            if (typeof type === "string" && typeof fn === "function") {
                if (typeof this._listener[type] === "undefined") {
                    this._listener[type] = [fn];
                } else {
                    this._listener[type].push(fn);
                }
            }
            return this;
        },
        addEvents: function (obj) {
            obj = typeof obj === "object" ? obj : {};
            var type;
            for (type in obj) {
                if (type && typeof obj[type] === "function") {
                    this.addEvent(type, obj[type]);
                }
            }
            return this;
        },
        fireEvent: function (type) {
            if (type && this._listener[type]) {
                var events = {
                    type: type,
                    target: this
                };

                for (var length = this._listener[type].length, start = 0; start < length; start += 1) {
                    this._listener[type][start].call(this, events);
                }
            }
            return this;
        },
        fireEvents: function (array) {
            if (array instanceof Array) {
                for (var i = 0, length = array.length; i < length; i += 1) {
                    this.fireEvent(array[i]);
                }
            }
            return this;
        },
        removeEvent: function (type, key) {
            var listeners = this._listener[type];
            if (listeners instanceof Array) {
                if (typeof key === "function") {
                    for (var i = 0, length = listeners.length; i < length; i += 1) {
                        if (listeners[i] === key) {
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                } else if (key instanceof Array) {
                    for (var lis = 0, lenkey = key.length; lis < lenkey; lis += 1) {
                        this.removeEvent(type, key[lenkey]);
                    }
                } else {
                    delete this._listener[type];
                }
            }
            return this;
        },
        removeEvents: function (params) {
            if (params instanceof Array) {
                for (var i = 0, length = params.length; i < length; i += 1) {
                    this.removeEvent(params[i]);
                }
            } else if (typeof params === "object") {
                for (var type in params) {
                    this.removeEvent(type, params[type]);
                }
            }
            return this;
        }
    };

    /***
    Litejs_touch v0.0.1
    ***/

    var swipe = function (elements, event_name, fn) {
        var swipeEvent = new _Event();
        swipeEvent.addEvent(event_name, fn);
        _swipe_event_init(elements,event_name,swipeEvent);
    }

    function _swipe_event_init(elements,event_name,s_event) {
        var startPosition, endPosition, deltaX, deltaY, moveLength, direction;

        function get_direction() {
            direction = Math.abs(deltaY) - Math.abs(deltaX);
        }
        for (i = 0; i < elements.length; i++) {
            elements[i].addEventListener('touchstart', function (e) {

                var touch = e.touches[0];
                startPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            });

            elements[i].addEventListener('touchmove', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                endPosition = {
                    x: touch.pageX,
                    y: touch.pageY
                }
                deltaX = endPosition.x - startPosition.x;
                deltaY = endPosition.y - startPosition.y;
            });

            elements[i].addEventListener('touchend', function (e) {
                _onTouchEnd(event_name,deltaX,deltaY,s_event);
            })
        }
    }
    
    function _onTouchEnd(event_name,deltaX,deltaY,s_event){
        if (event === "swipe"){
            s_event.fireEvent(event_name);
        }else{
            switch event{
                case "swipeLeft":
                    if (deltaX>0){
                        s_event.fireEvent(event_name)
                    };
                case "swipeLeft":
                    if (deltaX<0){
                        s_event.fireEvent(event_name)
                    };
                case "swipeTop":
                    if ((deltaX-deltaY)>0){
                        s_event.fireEvent(event_name)
                    };
                case "swipeBottom":
                    if ((deltaX-deltaY)<0){
                        s_event.fireEvent(event_name)
                    };
            }
        }
    }
    return {
        addClass: addClass,
        removeClass: removeClass,
        indexOf: indexOf,
        swipe: swipe
    }
})