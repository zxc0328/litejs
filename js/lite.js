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
    var addCusEventListener = function (elements, event_name, fn) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener(event_name, fn, false);
        }
    };
    var removeCusEventListener = function (elements, event_name, fn) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener(event_name, fn, false);
        }
    };
    var dispatchCusEvent = function (element, event_name) {
        var event = new Event(event_name);
        element.dispatchEvent(event);
    };


    /***
    Litejs_touch v0.0.1
    ***/

    var swipe = function (elements, event_name, fn) {
        var touchstart = function _onTouchstart(e) {
            console.log("called!");
            var touch = e.touches[0];
            startPosition = {
                x: touch.pageX,
                y: touch.pageY
            }
        }
        var touchmove = function _onTouchmove(e) {
            e.preventDefault();
            var touch = e.touches[0];
            endPosition = {
                x: touch.pageX,
                y: touch.pageY
            }
            deltaX = endPosition.x - startPosition.x;
            deltaY = endPosition.y - startPosition.y;
        }
        var touchend = function _onTouchend(e) {
            e.preventDefault();
            _onSwipeEnd(event_name, deltaX, deltaY, this);
        }

        function _swipe_event_init(elements, event_name) {
            var startPosition, endPosition, deltaX, deltaY, moveLength, direction;

            for (i = 0; i < elements.length; i++) {
                console.log("called!",touchstart);
                elements[i].addEventListener('touchstart', touchstart);

                elements[i].addEventListener('touchmove', touchmove);

                elements[i].addEventListener('touchend', touchend)
            }
        }

        function _onSwipeEnd(event_name, deltaX, deltaY, element) {
            if (event_name === "swipe") {
                dispatchCusEvent(element, event_name);
            } else {

                switch (event_name) {
                case "swipeLeft":
                    if (deltaX < 0) {
                        dispatchCusEvent(element, event_name);
                    };
                    break;
                case "swipeRight":
                    if (deltaX > 0) {
                        dispatchCusEvent(element, event_name);
                    };
                    break;
                case "swipeTop":
                    if ((deltaX - deltaY) > 0) {
                        dispatchCusEvent(element, event_name);
                    };
                    break;
                case "swipeBottom":
                    if ((deltaX - deltaY) < 0) {
                        dispatchCusEvent(element, event_name);
                    };
                    break;
                }
            }
        }
        addCusEventListener(elements, event_name, fn);
        _swipe_event_init(elements, event_name);
    }
    return {
        addClass: addClass,
        removeClass: removeClass,
        indexOf: indexOf,
        swipe: swipe
    }
})